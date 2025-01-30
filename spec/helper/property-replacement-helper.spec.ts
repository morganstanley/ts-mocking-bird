import { addMatchers, Mock, replaceProperties, replacePropertiesBeforeEach } from '../../main';
import {
    classReturnValue,
    functionOneReturnValue,
    functionThreeReturnValue,
    functionTwoReturnValue,
    SampleClassImport,
} from '../sut/sample-import';
import { SampleClass } from '../sut/sample-sut';

import { setupFunction, setupProperty } from '../../main/mock/operators';
import * as sampleImport from '../sut/sample-import';
import { AfterAllListener, BeforeAllListener } from '@vitest/runner';

describe('property replacement helper', () => {
    let setterValues: string[];
    let mockedSetterValues: string[];
    const mockedFunctionOneResult = 'mockedFunctionOneResult';
    const mockedFunctionTwoResult = 'mockedFunctionTwoResult';

    function mockedSampleFunctionOne() {
        return mockedFunctionOneResult;
    }

    function mockedSampleFunctionTwo() {
        return mockedFunctionTwoResult;
    }

    const mockObject = Mock.create<ClassWithFunctionAndInheritance>().setup(
        setupProperty('valueReplacedWithMock', 'value from Mock.create'),
    );

    const mocks: Partial<ClassWithFunctionAndInheritance> = {
        getString: mockedSampleFunctionOne,
        getBaseString: mockedSampleFunctionTwo,
        simpleValue: 'mockedSimpleValue',
    };

    Object.defineProperty(mocks, 'sampleGetterSetter', {
        get: () => 'mockedGetterValue',
        set: (value: string) => mockedSetterValues.push(value),
        enumerable: true,
    });

    beforeEach(() => {
        addMatchers();
        setterValues = [];
        mockedSetterValues = [];
    });

    class BaseClass {
        public getBaseString() {
            return `stringFromOriginalBaseFunction`;
        }
    }

    class ClassWithFunctionAndInheritance extends BaseClass {
        public valueReplacedWithMock = 'valueToBeReplacedWithMock';
        public simpleValue = 'originalSimpleValue';
        public getString() {
            return `stringFromOriginalFunction`;
        }

        public get sampleGetterSetter() {
            return 'sampleGetterValue';
        }

        public set sampleGetterSetter(value: string) {
            setterValues.push(value);
        }
    }

    function getInstance() {
        return new SampleClass();
    }

    const classInstanceOne = new ClassWithFunctionAndInheritance();
    const classInstanceTwo = new ClassWithFunctionAndInheritance();

    describe('non-mocked imports', () => {
        it('should return original function result', () => {
            const instance = getInstance();

            expect(instance.wrapFunctionOne()).toEqual(functionOneReturnValue);
            expect(instance.wrapFunctionTwo()).toEqual(functionTwoReturnValue);
            expect(instance.wrapFunctionThree()).toEqual(functionThreeReturnValue);
            expect(instance.valueFromClass()).toEqual(classReturnValue);

            expect(classInstanceOne.getBaseString()).toEqual('stringFromOriginalBaseFunction');
            expect(classInstanceOne.getString()).toEqual('stringFromOriginalFunction');
            expect(classInstanceOne.valueReplacedWithMock).toEqual('valueToBeReplacedWithMock');
            expect(classInstanceOne.sampleGetterSetter).toEqual('sampleGetterValue');
            expect(classInstanceOne.simpleValue).toEqual('originalSimpleValue');
            classInstanceOne.sampleGetterSetter = 'sampleValue';
            expect(setterValues).toEqual(['sampleValue']);
        });
    });

    describe('replaceProperties', () => {
        const mockedClassResult = 'mockClassReturnValue';

        const mockClass = Mock.create<SampleClassImport>().setup(
            setupFunction('sampleFunction', () => mockedClassResult),
        );

        replaceProperties(sampleImport, {
            sampleFunctionOne: mockedSampleFunctionOne,
            sampleFunctionTwo: mockedSampleFunctionTwo,
            SampleClassImport: mockClass.mockConstructor,
        });

        replaceProperties(classInstanceOne, mocks);
        replaceProperties(classInstanceOne, mockObject.mock);

        it('should return mocked function result', () => {
            const instance = getInstance();

            expect(instance.wrapFunctionOne()).toEqual(mockedFunctionOneResult);
            expect(instance.wrapFunctionTwo()).toEqual(mockedFunctionTwoResult);
            expect(instance.wrapFunctionThree()).toEqual(functionThreeReturnValue);
            expect(instance.valueFromClass()).toEqual(mockedClassResult);

            expect(classInstanceOne.getString()).toEqual(mockedFunctionOneResult);
            expect(classInstanceOne.getBaseString()).toEqual(mockedFunctionTwoResult);
            expect(classInstanceOne.valueReplacedWithMock).toEqual('value from Mock.create');
            classInstanceOne.valueReplacedWithMock = 'testing mock setter';
            expect(
                mockObject.withSetter('valueReplacedWithMock').withParameters('testing mock setter'),
            ).wasCalledOnce();
            expect(classInstanceOne.simpleValue).toEqual('mockedSimpleValue');
            expect(classInstanceOne.sampleGetterSetter).toEqual('mockedGetterValue');
            classInstanceOne.sampleGetterSetter = 'mockedSetterValueOne';
            expect(setterValues).toEqual([]);
            expect(mockedSetterValues).toEqual(['mockedSetterValueOne']);
        });

        it("should reset values when 'afterAll' is called", () => {
            const originalObject = {
                propOne: 'originalPropOne',
                propTwo: 'originalPropTwo',
            };

            let beforeAllCallback: BeforeAllListener | undefined;
            let afterAllCallback: AfterAllListener | undefined;

            replaceProperties(
                originalObject,
                {
                    propOne: 'mockedPropOne',
                    propTwo: 'mockedPropTwo',
                },
                {
                    afterAll: (callback) => (afterAllCallback = callback),
                    beforeAll: (callback) => (beforeAllCallback = callback),
                },
            );

            // beforeAll not called yet
            expect(originalObject.propOne).toEqual('originalPropOne');
            expect(originalObject.propTwo).toEqual('originalPropTwo');

            if (beforeAllCallback != null) {
                beforeAllCallback({} as any);
            } else {
                throw new Error('beforeAllCallback is not defined');
            }

            expect(originalObject.propOne).toEqual('mockedPropOne');
            expect(originalObject.propTwo).toEqual('mockedPropTwo');

            if (afterAllCallback != null) {
                afterAllCallback({} as any);
            } else {
                throw new Error('afterAllCallback is not defined');
            }

            expect(originalObject.propOne).toEqual('originalPropOne');
            expect(originalObject.propTwo).toEqual('originalPropTwo');
        });
    });

    describe('replacePropertiesBeforeEach', () => {
        const mockedClassResult = 'mockClassReturnValue';

        replacePropertiesBeforeEach(() => {
            const mockClass = Mock.create<SampleClassImport>().setup(
                setupFunction('sampleFunction', () => mockedClassResult),
            );

            return [
                {
                    package: sampleImport,
                    mocks: {
                        sampleFunctionOne: mockedSampleFunctionOne,
                        sampleFunctionTwo: mockedSampleFunctionTwo,
                        SampleClassImport: mockClass.mockConstructor,
                    },
                },
                {
                    package: classInstanceTwo,
                    mocks,
                },
            ];
        });

        it('should return mocked function result', () => {
            const instance = getInstance();

            expect(instance.wrapFunctionOne()).toEqual(mockedFunctionOneResult);
            expect(instance.wrapFunctionTwo()).toEqual(mockedFunctionTwoResult);
            expect(instance.wrapFunctionThree()).toEqual(functionThreeReturnValue);
            expect(instance.valueFromClass()).toEqual(mockedClassResult);
            expect(classInstanceTwo.getString()).toEqual(mockedFunctionOneResult);
            expect(classInstanceTwo.getBaseString()).toEqual(mockedFunctionTwoResult);
            expect(classInstanceTwo.simpleValue).toEqual('mockedSimpleValue');
            expect(classInstanceTwo.sampleGetterSetter).toEqual('mockedGetterValue');
            classInstanceTwo.sampleGetterSetter = 'mockedSetterValueTwo';
            expect(setterValues).toEqual([]);
            expect(mockedSetterValues).toEqual(['mockedSetterValueTwo']);
        });
    });

    afterAll(() => {
        const instance = getInstance();

        setterValues = [];

        expect(instance.wrapFunctionOne()).toEqual(functionOneReturnValue);
        expect(instance.wrapFunctionTwo()).toEqual(functionTwoReturnValue);
        expect(instance.wrapFunctionThree()).toEqual(functionThreeReturnValue);
        expect(instance.valueFromClass()).toEqual(classReturnValue);

        expect(classInstanceOne.getBaseString()).toEqual('stringFromOriginalBaseFunction');
        expect(classInstanceOne.getString()).toEqual('stringFromOriginalFunction');
        expect(classInstanceOne.valueReplacedWithMock).toEqual('valueToBeReplacedWithMock');
        expect(classInstanceOne.sampleGetterSetter).toEqual('sampleGetterValue');
        expect(classInstanceOne.simpleValue).toEqual('originalSimpleValue');
        classInstanceOne.sampleGetterSetter = 'sampleAfterAllValueOne';
        expect(setterValues).toEqual(['sampleAfterAllValueOne']);

        expect(classInstanceTwo.getBaseString()).toEqual('stringFromOriginalBaseFunction');
        expect(classInstanceTwo.getString()).toEqual('stringFromOriginalFunction');
        expect(classInstanceTwo.valueReplacedWithMock).toEqual('valueToBeReplacedWithMock');
        expect(classInstanceTwo.sampleGetterSetter).toEqual('sampleGetterValue');
        expect(classInstanceTwo.simpleValue).toEqual('originalSimpleValue');
        classInstanceTwo.sampleGetterSetter = 'sampleAfterAllValueTwo';
        expect(setterValues).toEqual(['sampleAfterAllValueOne', 'sampleAfterAllValueTwo']);
    });
});
