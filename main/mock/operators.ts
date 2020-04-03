import {
    ConstructorFunction,
    FunctionCallLookup,
    FunctionsOnly,
    FunctionType,
    IMocked,
    OperatorFunction,
} from './contracts';
import { FunctionName } from './verifiers';

/**
 * Mocks a function on an existing Mock.
 * Allows function call verification to be performed later in the test.
 * You can optionally set a mock function implementation that will be called.
 *
 * @param functionName
 * @param mockFunction
 */
export function setupFunction<T, C extends ConstructorFunction<T>, U extends keyof FunctionsOnly<T>>(
    functionName: U,
    mockFunction?: T[U],
): OperatorFunction<T, C> {
    return (mocked: IMocked<T, C>) => {
        const functionReplacement = (...args: any[]) => {
            let returnValue: any;

            if (mockFunction instanceof Function) {
                returnValue = mockFunction.apply(mocked.mock, args);
            }
            trackFunctionCall(mocked, functionName as string, args, false);

            return returnValue;
        };

        mocked.mock[functionName] = functionReplacement as any;
        mocked.functionCallLookup[functionName as any] = [];

        return mocked;
    };
}

/**
 * Mocks a staticfunction on an existing Mock.
 * Allows function call verification to be performed later in the test.
 * You can optionally set a mock function implementation that will be called.
 *
 * @param functionName
 * @param mockFunction
 */
export function setupStaticFunction<T, C extends ConstructorFunction<T>, U extends keyof FunctionsOnly<C>>(
    functionName: U,
    mockFunction?: C[U],
): OperatorFunction<T, C> {
    return (mocked: IMocked<T, C>) => {
        const functionReplacement = (...args: any[]) => {
            let returnValue: any;

            if (mockFunction instanceof Function) {
                returnValue = mockFunction.apply(mocked.mock, args);
            }
            trackFunctionCall(mocked, functionName as string, args, true);

            return returnValue;
        };

        mocked.mockConstructor[functionName] = functionReplacement as any;
        mocked.staticFunctionCallLookup[functionName as any] = [];

        return mocked;
    };
}

/**
 * Sets up a property on an existing Mock.
 * Allows the value of the property to be defined.
 * Enables get and set function call verification to be performed.
 *
 * @param propertyName
 * @param value
 */
export function setupProperty<T, C extends ConstructorFunction<T>, U extends keyof T>(
    propertyName: U,
    value?: T[U],
): OperatorFunction<T, C> {
    return defineProperty(propertyName, value != null ? () => value : undefined);
}

/**
 * Sets up a static property on an existing Mock.
 * Allows the value of the property to be defined.
 * Enables get and set function call verification to be performed.
 *
 * @param propertyName
 * @param value
 */
export function setupStaticProperty<T, C extends ConstructorFunction<T>, U extends keyof C>(
    propertyName: U,
    value?: C[U],
): OperatorFunction<T, C> {
    return defineStaticProperty(propertyName, value ? () => value : undefined);
}

/**
 * Sets up a property on an existing Mock.
 * Allows getter and setter functions to be set.
 * Enables get and set function call verification to be performed.
 *
 * @param propertyName
 * @param value
 */
export function defineProperty<T, C extends ConstructorFunction<T>, U extends keyof T>(
    propertyName: U,
    getter?: () => T[U],
    setter?: (value: T[U]) => void,
): OperatorFunction<T, C> {
    return (mocked: IMocked<T, C>) => {
        return definePropertyImpl(mocked, 'getter', propertyName, false, getter, setter);
    };
}

/**
 * Sets up a static property on an existing Mock with constructor.
 * Allows getter and setter functions to be set.
 * Enables get and set function call verification to be performed.
 *
 * @param propertyName
 * @param value
 */
export function defineStaticProperty<T, C extends ConstructorFunction<T>, U extends keyof C>(
    propertyName: U,
    getter?: () => C[U],
    setter?: (value: C[U]) => void,
): OperatorFunction<T, C> {
    return (mocked: IMocked<T, C>) => {
        return definePropertyImpl(mocked, 'staticGetter', propertyName, true, getter, setter);
    };
}

function definePropertyImpl<
    T,
    C extends ConstructorFunction<T>,
    U extends FunctionType,
    K extends FunctionName<T, C, U>
>(
    mocked: IMocked<T, C>,
    _type: U,
    propertyName: K,
    isStatic: boolean,
    getter?: () => any,
    setter?: (value: any) => void,
): IMocked<T, C> {
    const propertyGetter = () => {
        trackGetterCall(mocked, propertyName as string, isStatic);

        return getter ? getter() : undefined;
    };

    const propertySetter = (value: any) => {
        trackSetterCall(mocked, propertyName as string, value, isStatic);

        if (setter != null) {
            setter.apply(mocked.mock, [value]);
        }
    };

    const object = isStatic ? mocked.mockConstructor : mocked.mock;

    Object.defineProperty(object, propertyName, {
        enumerable: true,
        get: propertyGetter,
        set: propertySetter,
        configurable: true,
    });

    if (isStatic) {
        mocked.staticGetterCallLookup[propertyName as any] = [];
        mocked.staticSetterCallLookup[propertyName as any] = [];
    } else {
        mocked.getterCallLookup[propertyName as any] = [];
        mocked.setterCallLookup[propertyName as any] = [];
    }

    return mocked;
}

function trackFunctionCall<T, C extends ConstructorFunction<T>>(
    mock: IMocked<T, C>,
    functionName: string,
    params: any[],
    isStatic: boolean,
) {
    const lookup = isStatic ? mock.staticFunctionCallLookup : mock.functionCallLookup;

    trackCall(lookup, functionName, params);
}

function trackGetterCall<T, C extends ConstructorFunction<T>>(
    mock: IMocked<T, C>,
    propertyName: string,
    isStatic: boolean,
) {
    const lookup = isStatic ? mock.staticGetterCallLookup : mock.getterCallLookup;

    //  it's easier to have an array of empty arrays than just keep track of a count
    //  This allows us to use the same verification code as the setter and functions
    trackCall(lookup, propertyName, []);
}

function trackSetterCall<T, C extends ConstructorFunction<T>>(
    mock: IMocked<T, C>,
    propertyName: string,
    param: any,
    isStatic: boolean,
) {
    const lookup = isStatic ? mock.staticSetterCallLookup : mock.setterCallLookup;

    trackCall(lookup, propertyName, [param]);
}

function trackCall(lookup: FunctionCallLookup, name: string, params: any[]) {
    if (lookup[name as any] === undefined) {
        lookup[name as any] = [];
    }

    lookup[name as any].push(params);
}
