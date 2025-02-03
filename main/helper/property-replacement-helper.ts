import type {
    afterAll as vitestAfterAll,
    afterEach as vitestAfterEach,
    beforeAll as vitestBeforeAll,
    beforeEach as vitestBeforeEach,
} from '../mock/framework.contracts';

/* eslint-disable @typescript-eslint/ban-types */
/**
 * This is hacky and should never be done in non-test code
 * We need to do this as webpack builds immutable export objects that uses Object.defineProperty with configurable set to false
 * This means we are unable to replace the imports at runtime and mock them.
 */
((defineProperty) => {
    Object.defineProperty = (obj, prop, desc) => {
        if (prop === 'prototype' && typeof obj === 'function') {
            // do not make class prototype properties writable
            // if we try to do this things blow up in ng 13 (babel and zone.js)
            return defineProperty(obj, prop, desc);
        }

        desc.configurable = true;
        return defineProperty(obj, prop, desc);
    };
})(Object.defineProperty);

type PropertyDescriptors<T> = {
    [P in keyof T]: TypedPropertyDescriptor<T[P]>;
};

export interface IImportReplacement<T extends {}> {
    package: T;
    mocks: Partial<T>;
}

interface IImportCopy<T> {
    objectWithReplacements: T;
    descriptors: PropertyDescriptors<Partial<T>>;
}

/**
 * Replaces properties (or functions) in the provided object
 * Replacement is done in a call to 'beforeAll'.
 * Properties are reverted to the original value in a call to 'afterAll'
 *
 * @param target The original object. Could be an import: 'import * as myImport from "./importLocation"'
 * @param mocks Object containing functions or properties to replace
 * @param functions Optional object containing beforeAll and afterAll functions to use instead of the global ones
 */
export function replaceProperties<T extends Record<string, any>>(
    target: T,
    mocks: Partial<T>,
    functions?: { beforeAll: vitestBeforeAll; afterAll: vitestAfterAll },
) {
    const descriptors = getDescriptors(target, mocks);

    // if a function is passed in we use that, otherwise we use the global beforeAll
    // a function will need to be passed in for vitest when running in non global mode
    (functions?.beforeAll ?? beforeAll)(() => {
        replacePropertiesImpl(mocks, target);
    });

    (functions?.afterAll ?? afterAll)(() => {
        revertProperties(target, descriptors);
    });
}

export const mockImports = replaceProperties;

/**
 * Replaces functions, classes or simple values in objects.
 * This runs before each test allowing us to create a new mock object before each test and assert function calls
 *
 * Example:
 *
 * // SUT:
 * import { sampleFunction, SampleClass} from "someImport";
 *
 * export MyClass{
 *      public getValue(){
 *          return new SampleClass();
 *      }
 *
 *      public getOtherValue(){
 *          return sampleFunction();
 *      }
 * }
 *
 * // Test:
 *
 * describe("test", () => {
 *
 * import * as importToMock from "someImport";
 *
 * replacePropertiesBeforeEach(() => {
 *  const mockedClass = Mock.create<SampleClass>().setupFunction("getValue");
 *  const mockedFunction = () => "mockedValue";
 *
 *  return [{package: importToMock, mocks: {SampleClass: mockedClass.mockConstructor, sampleFunction: mockedFunction}}];
 * });
 *
 * })
 *
 * @param callback a function used to setup your mocks and to return an array of import replacements
 * @param functions Optional object containing beforeEach and afterEach functions to use instead of the global ones
 */
export function replacePropertiesBeforeEach(
    callback: () => IImportReplacement<any>[],
    functions?: { beforeEach: vitestBeforeEach; afterEach: vitestAfterEach },
) {
    const importCopies: IImportCopy<any>[] = [];

    (functions?.beforeEach ?? beforeEach)(() => {
        const mockedImports = callback();

        mockedImports.forEach((importReplacement) => {
            importCopies.push({
                objectWithReplacements: importReplacement.package,
                descriptors: getDescriptors(importReplacement.package, importReplacement.mocks),
            });

            replacePropertiesImpl(importReplacement.mocks, importReplacement.package);
        });
    });

    (functions?.afterEach ?? afterEach)(() => {
        importCopies.forEach((copy) => revertProperties(copy.objectWithReplacements, copy.descriptors));
    });
}

export const mockImportsBeforeEach = replacePropertiesBeforeEach;

function getDescriptors<T extends {}, TMock extends Partial<T>>(original: T, mocks: TMock): PropertyDescriptors<TMock> {
    const descriptors: PropertyDescriptors<TMock> = {} as any;

    for (const key in mocks) {
        if (mocks[key] != null) {
            descriptors[key] = getDescriptor(original, key);
        }
    }

    return descriptors;
}

function getDescriptor<T extends object, K extends keyof T>(target: object, key: K): TypedPropertyDescriptor<T[K]> {
    if (target == null) {
        throw Error(`Could not resolve property descriptor ${String(key)}`);
    }

    const descriptor = Object.getOwnPropertyDescriptor(target, key);

    if (descriptor == null) {
        return getDescriptor((target as any).__proto__, key);
    }

    return descriptor;
}

function replacePropertiesImpl<T>(replacements: Partial<T>, originalPackage: T) {
    for (const propertyName in replacements) {
        if (replacements[propertyName] != null) {
            const mockDescriptor = getDescriptor(replacements, propertyName as never);
            try {
                Object.defineProperty(originalPackage, propertyName, mockDescriptor);
            } catch (e) {
                throw new Error(
                    `Error when trying to mock import '${propertyName}':\n${e}\nPlease see readme about likely cause and ways to resolve`,
                );
            }
        }
    }
}

function revertProperties<T>(packageWithReplacements: T, descriptors: PropertyDescriptors<Partial<T>>) {
    for (const key in descriptors) {
        if (descriptors[key] != null) {
            Object.defineProperty(packageWithReplacements, key, descriptors[key]);
        }
    }
}
