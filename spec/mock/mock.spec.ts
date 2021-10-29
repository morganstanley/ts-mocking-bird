/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {
    addMatchers,
    any,
    hasValue,
    IMocked,
    IParameterMatcher,
    matchers,
    Mock,
    toBe,
    toBeDefined,
    toEqual,
} from '../../main';
import { defineProperty, setupFunction, setupProperty } from '../../main/mock/operators';
import { verifyFailure, verifyJestFailure } from './failure-verifier';

describe('mock', () => {
    let mocked: IMocked<SampleMockedClass, typeof SampleMockedClass>;
    let mock: SampleMockedClass;

    // just a convenience to get a value and avoid compile / lint errors
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function get(_value: any) {}

    beforeEach(() => {
        addMatchers();
        mocked = Mock.create<SampleMockedClass, typeof SampleMockedClass>();
        mock = mocked.mock;
    });

    describe('lookups', () => {
        it('function lookup should be typed correctly', () => {
            expect(mocked.functionCallLookup.functionWithParamsAndNoReturn).toBeUndefined();

            mocked.setupFunction('functionWithParamsAndNoReturn');

            expect(mocked.functionCallLookup.functionWithParamsAndNoReturn).toBeDefined();

            mock.functionWithParamsAndNoReturn('one', 2, true);

            if (mocked.functionCallLookup.functionWithParamsAndNoReturn != null) {
                const firstCall = mocked.functionCallLookup.functionWithParamsAndNoReturn[0];

                const firstParam: string = firstCall[0];
                const secondParam: number = firstCall[1];
                const thirdParam: boolean | undefined = firstCall[2];

                expect(firstParam).toBe('one');
                expect(secondParam).toBe(2);
                expect(thirdParam).toBe(true);
            }
        });

        it('setter lookup should be typed correctly', () => {
            expect(mocked.setterCallLookup.propertyOne).toBeUndefined();
            expect(mocked.setterCallLookup.propertyTwo).toBeUndefined();

            mocked.setupProperty('propertyOne');
            mocked.setupProperty('propertyTwo');

            expect(mocked.setterCallLookup.propertyOne).toBeDefined();
            expect(mocked.setterCallLookup.propertyTwo).toBeDefined();

            mock.propertyOne = 'valueOne';
            mock.propertyTwo = 2;

            if (mocked.setterCallLookup.propertyOne != null) {
                const firstCall = mocked.setterCallLookup.propertyOne[0];
                const param: string = firstCall[0];

                expect(param).toBe('valueOne');
            }

            if (mocked.setterCallLookup.propertyTwo != null) {
                const firstCall = mocked.setterCallLookup.propertyTwo[0];
                const param: number = firstCall[0];

                expect(param).toBe(2);
            }
        });

        it('getter lookup should be typed correctly', () => {
            expect(mocked.getterCallLookup.propertyOne).toBeUndefined();
            expect(mocked.getterCallLookup.propertyTwo).toBeUndefined();

            mocked.setupProperty('propertyOne');
            mocked.setupProperty('propertyTwo');

            expect(mocked.getterCallLookup.propertyOne).toBeDefined();
            expect(mocked.getterCallLookup.propertyTwo).toBeDefined();

            const propOneValue = mock.propertyOne;
            const propTwoValue = mock.propertyTwo;

            expect(propOneValue).toBeUndefined();
            expect(propTwoValue).toBeUndefined();

            if (mocked.getterCallLookup.propertyOne != null) {
                const firstCall = mocked.getterCallLookup.propertyOne[0];

                expect(firstCall).toBeDefined();
            }

            if (mocked.getterCallLookup.propertyTwo != null) {
                const firstCall = mocked.getterCallLookup.propertyTwo[0];

                expect(firstCall).toBeDefined();
            }
        });

        it('static function lookup should be typed correctly', () => {
            expect(mocked.staticFunctionCallLookup.doStuffWithParams).toBeUndefined();

            mocked.setupStaticFunction('doStuffWithParams');

            expect(mocked.staticFunctionCallLookup.doStuffWithParams).toBeDefined();

            mocked.mockConstructor.doStuffWithParams('one', 2, true);

            if (mocked.staticFunctionCallLookup.doStuffWithParams != null) {
                const firstCall = mocked.staticFunctionCallLookup.doStuffWithParams[0];

                const firstParam: string = firstCall[0];
                const secondParam: number = firstCall[1];

                const thirdParam: boolean | undefined = firstCall[2];

                expect(firstParam).toBe('one');
                expect(secondParam).toBe(2);
                expect(thirdParam).toBe(true);
            }
        });

        it('static setter lookup should be typed correctly', () => {
            expect(mocked.staticSetterCallLookup.propertyOne).toBeUndefined();
            expect(mocked.staticSetterCallLookup.propertyTwo).toBeUndefined();

            mocked.setupStaticProperty('propertyOne');
            mocked.setupStaticProperty('propertyTwo');

            expect(mocked.staticSetterCallLookup.propertyOne).toBeDefined();
            expect(mocked.staticSetterCallLookup.propertyTwo).toBeDefined();

            mocked.mockConstructor.propertyOne = 'valueOne';
            mocked.mockConstructor.propertyTwo = 2;

            if (mocked.staticSetterCallLookup.propertyOne != null) {
                const firstCall = mocked.staticSetterCallLookup.propertyOne[0];
                const param: string = firstCall[0];

                expect(param).toBe('valueOne');
            }

            if (mocked.staticSetterCallLookup.propertyTwo != null) {
                const firstCall = mocked.staticSetterCallLookup.propertyTwo[0];
                const param: number = firstCall[0];

                expect(param).toBe(2);
            }
        });

        it('static getter lookup should be typed correctly', () => {
            expect(mocked.staticGetterCallLookup.propertyOne).toBeUndefined();
            expect(mocked.staticGetterCallLookup.propertyTwo).toBeUndefined();

            mocked.setupStaticProperty('propertyOne');
            mocked.setupStaticProperty('propertyTwo');

            expect(mocked.staticGetterCallLookup.propertyOne).toBeDefined();
            expect(mocked.staticGetterCallLookup.propertyTwo).toBeDefined();

            const propOneValue = mocked.mockConstructor.propertyOne;
            const propTwoValue = mocked.mockConstructor.propertyTwo;

            expect(propOneValue).toBeUndefined();
            expect(propTwoValue).toBeUndefined();

            if (mocked.staticGetterCallLookup.propertyOne != null) {
                const firstCall = mocked.staticGetterCallLookup.propertyOne[0];

                expect(firstCall).toBeDefined();
            }

            if (mocked.staticGetterCallLookup.propertyTwo != null) {
                const firstCall = mocked.staticGetterCallLookup.propertyTwo[0];

                expect(firstCall).toBeDefined();
            }
        });
    });

    describe('setup', () => {
        it('withFunction will fail with a meaningful error if we try to assert a function that is not setup', () => {
            verifyFailure(
                mocked.withFunction('functionWithNoParamsAndNoReturn'),
                matchers.wasNotCalled(),
                `Function "functionWithNoParamsAndNoReturn" has not been setup. Please setup using Mock.setupFunction() before verifying calls.`,
            );
        });

        it('withGetter will fail with a meaningful error if we try to assert a getter that is not setup', () => {
            verifyFailure(
                mocked.withGetter('propertyOne'),
                matchers.wasNotCalled(),
                `Property "propertyOne" has not been setup. Please setup using Mock.setupProperty() before verifying calls.`,
            );
        });

        it('withSetter will fail with a meaningful error if we try to assert a setter that is not setup', () => {
            verifyFailure(
                mocked.withSetter('propertyTwo'),
                matchers.wasNotCalled(),
                `Property "propertyTwo" has not been setup. Please setup using Mock.setupProperty() before verifying calls.`,
            );
        });
    });

    describe('withFunction', () => {
        it('called directly on mock instance', () => {
            mocked.setup(setupFunction('functionWithNoParamsAndNoReturn'));

            mock.functionWithNoParamsAndNoReturn();

            expect(mocked.withFunction('functionWithNoParamsAndNoReturn')).wasCalledAtLeastOnce();
        });

        it('called on checker returned from setup function', () => {
            const verifier = mocked.setupFunction('functionWithNoParamsAndNoReturn');

            mock.functionWithNoParamsAndNoReturn();

            expect(verifier).wasCalledAtLeastOnce();
        });

        describe('assertion with no parameters', () => {
            beforeEach(() => {
                mocked.setup(setupFunction('functionWithNoParamsAndNoReturn'));
            });
            afterEach(() => {
                delete (expect as any).extend;
            });

            describe('wasCalledAtLeastOnce()', () => {
                it('should not fail when function has been called once', () => {
                    mock.functionWithNoParamsAndNoReturn();

                    expect(mocked.withFunction('functionWithNoParamsAndNoReturn')).wasCalledAtLeastOnce();
                });

                it('should not fail when function has been called multiple times', () => {
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();

                    expect(mocked.withFunction('functionWithNoParamsAndNoReturn')).wasCalledAtLeastOnce();
                });

                it('should fail when function has not been called', () => {
                    verifyFailure(
                        mocked.withFunction('functionWithNoParamsAndNoReturn'),
                        matchers.wasCalledAtLeastOnce(),
                        `Expected "functionWithNoParamsAndNoReturn" to be called but it was not.`,
                    );
                });

                it('when running in jest it should return a CustomMatcherResult with a function for message', () => {
                    (expect as any).extend = () => console.log(`Temp function to fool we're using jest`);

                    verifyJestFailure(
                        mocked.withFunction('functionWithNoParamsAndNoReturn'),
                        matchers.wasCalledAtLeastOnce(),
                        `Expected "functionWithNoParamsAndNoReturn" to be called but it was not.`,
                    );
                });
            });

            describe('wasNotCalled()', () => {
                it('should fail when function has been called once', () => {
                    mock.functionWithNoParamsAndNoReturn();

                    verifyFailure(
                        mocked.withFunction('functionWithNoParamsAndNoReturn'),
                        matchers.wasNotCalled(),
                        `Expected "functionWithNoParamsAndNoReturn" to be called 0 times but it was called 1 times with matching parameters and 1 times in total.`,
                    );
                });

                it('should fail when function has been called multiple times', () => {
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();

                    verifyFailure(
                        mocked.withFunction('functionWithNoParamsAndNoReturn'),
                        matchers.wasNotCalled(),
                        `Expected "functionWithNoParamsAndNoReturn" to be called 0 times but it was called 3 times with matching parameters and 3 times in total.`,
                    );
                });

                it('should not fail when function has not been called', () => {
                    expect(mocked.withFunction('functionWithNoParamsAndNoReturn')).wasNotCalled();
                });
            });

            describe('wasCalled(0)', () => {
                it('should fail when function has been called once', () => {
                    mock.functionWithNoParamsAndNoReturn();

                    verifyFailure(
                        mocked.withFunction('functionWithNoParamsAndNoReturn'),
                        matchers.wasCalled(),
                        `Expected "functionWithNoParamsAndNoReturn" to be called 0 times but it was called 1 times with matching parameters and 1 times in total.`,
                        0,
                    );
                });

                it("should throw an error if 'times: number' not passed to wasCalled", () => {
                    expect(() =>
                        (expect(mocked.withFunction('functionWithNoParamsAndNoReturn')) as any).wasCalled(),
                    ).toThrowError(
                        'Expected call count must be passed to wasCalled(times: number). To verify that it was called at least once use wasCalledAtLeastOnce().',
                    );
                });

                it('should fail when function has been called multiple times', () => {
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();

                    verifyFailure(
                        mocked.withFunction('functionWithNoParamsAndNoReturn'),
                        matchers.wasCalled(),
                        `Expected "functionWithNoParamsAndNoReturn" to be called 0 times but it was called 3 times with matching parameters and 3 times in total.`,
                        0,
                    );
                });

                it('should not fail when function has not been called', () => {
                    expect(mocked.withFunction('functionWithNoParamsAndNoReturn')).wasCalled(0);
                });
            });

            describe('wasCalledOnce', () => {
                it('should not fail when function has been called once', () => {
                    mock.functionWithNoParamsAndNoReturn();

                    expect(mocked.withFunction('functionWithNoParamsAndNoReturn')).wasCalledOnce();
                });

                it('should fail when function has been called multiple times', () => {
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();

                    verifyFailure(
                        mocked.withFunction('functionWithNoParamsAndNoReturn'),
                        matchers.wasCalledOnce(),
                        `Expected "functionWithNoParamsAndNoReturn" to be called 1 times but it was called 3 times with matching parameters and 3 times in total.`,
                    );
                });

                it('should fail when function has not been called', () => {
                    verifyFailure(
                        mocked.withFunction('functionWithNoParamsAndNoReturn'),
                        matchers.wasCalledOnce(),
                        `Expected "functionWithNoParamsAndNoReturn" to be called 1 times but it was called 0 times with matching parameters and 0 times in total.`,
                    );
                });
            });

            describe('wasCalled(1)', () => {
                it('should not fail when function has been called once', () => {
                    mock.functionWithNoParamsAndNoReturn();

                    expect(mocked.withFunction('functionWithNoParamsAndNoReturn')).wasCalled(1);
                });

                it('should fail when function has been called multiple times', () => {
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();

                    verifyFailure(
                        mocked.withFunction('functionWithNoParamsAndNoReturn'),
                        matchers.wasCalled(),
                        `Expected "functionWithNoParamsAndNoReturn" to be called 1 times but it was called 3 times with matching parameters and 3 times in total.`,
                        1,
                    );
                });

                it('should fail when function has not been called', () => {
                    verifyFailure(
                        mocked.withFunction('functionWithNoParamsAndNoReturn'),
                        matchers.wasCalled(),
                        `Expected "functionWithNoParamsAndNoReturn" to be called 1 times but it was called 0 times with matching parameters and 0 times in total.`,
                        1,
                    );
                });
            });

            describe('wasCalled(2)', () => {
                it('should fail when function has been called once', () => {
                    mock.functionWithNoParamsAndNoReturn();

                    verifyFailure(
                        mocked.withFunction('functionWithNoParamsAndNoReturn'),
                        matchers.wasCalled(),
                        `Expected "functionWithNoParamsAndNoReturn" to be called 2 times but it was called 1 times with matching parameters and 1 times in total.`,
                        2,
                    );
                });

                it('should not fail when function has been called twice', () => {
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();

                    expect(mocked.withFunction('functionWithNoParamsAndNoReturn')).wasCalled(2);
                });

                it('should fail when function has been called multiple times', () => {
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();

                    verifyFailure(
                        mocked.withFunction('functionWithNoParamsAndNoReturn'),
                        matchers.wasCalled(),
                        `Expected "functionWithNoParamsAndNoReturn" to be called 2 times but it was called 3 times with matching parameters and 3 times in total.`,
                        2,
                    );
                });

                it('should fail when function has not been called', () => {
                    verifyFailure(
                        mocked.withFunction('functionWithNoParamsAndNoReturn'),
                        matchers.wasCalled(),
                        `Expected "functionWithNoParamsAndNoReturn" to be called 2 times but it was called 0 times with matching parameters and 0 times in total.`,
                        2,
                    );
                });
            });
        });

        describe('assertion with parameters', () => {
            beforeEach(() => {
                mocked.setup(setupFunction('functionWithParamsAndReturn'), setupFunction('functionWithComplexParam'));
            });

            describe('wasCalledAtLeastOnce()', () => {
                it('should not fail when function has been called once with matching params', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);

                    expect(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true),
                    ).wasCalledAtLeastOnce();
                });

                it(`should fail when function has been called once with "two" instead of "one"`, () => {
                    mock.functionWithParamsAndReturn('two', 123, true);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true),
                        matchers.wasCalledAtLeastOnce(),
                        `Expected "functionWithParamsAndReturn" to be called with params ["one", 123, true] but it was only called with these parameters:\n[\n["two",123,true]\n]`,
                    );
                });

                it(`should fail when function has been called once with "456" instead of "123"`, () => {
                    mock.functionWithParamsAndReturn('one', 456, true);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true),
                        matchers.wasCalledAtLeastOnce(),
                        `Expected "functionWithParamsAndReturn" to be called with params ["one", 123, true] but it was only called with these parameters:\n[\n["one",456,true]\n]`,
                    );
                });

                it(`should fail when function has been called with object with undefined value`, () => {
                    mock.functionWithComplexParam({ one: 'one', two: 2, three: undefined });

                    verifyFailure(
                        mocked.withFunction('functionWithComplexParam').withParametersEqualTo({ one: 'one', two: 2 }),
                        matchers.wasCalledOnce(),
                        `Expected "functionWithComplexParam" to be called 1 times with params [{"one":"one","two":2}] but it was called 0 times with matching parameters and 1 times in total.\n[\n[{"one":"one","two":2,"three":undefined}]\n]`,
                    );
                });

                it(`should fail when function expects object with undefined value`, () => {
                    mock.functionWithComplexParam({ one: 'one', two: 2 });

                    verifyFailure(
                        mocked
                            .withFunction('functionWithComplexParam')
                            .withParametersEqualTo({ one: 'one', two: 2, three: undefined }),
                        matchers.wasCalledOnce(),
                        `Expected "functionWithComplexParam" to be called 1 times with params [{"one":"one","two":2,"three":undefined}] but it was called 0 times with matching parameters and 1 times in total.\n[\n[{"one":"one","two":2}]\n]`,
                    );
                });

                it(`should fail when function has been called once with "false" instead of "true"`, () => {
                    mock.functionWithParamsAndReturn('one', 123, false);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true),
                        matchers.wasCalledAtLeastOnce(),
                        `Expected "functionWithParamsAndReturn" to be called with params ["one", 123, true] but it was only called with these parameters:\n[\n["one",123,false]\n]`,
                    );
                });

                it('should fail when function has been called once with missing parameters', () => {
                    mock.functionWithParamsAndReturn('one');

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true),
                        matchers.wasCalledAtLeastOnce(),
                        `Expected "functionWithParamsAndReturn" to be called with params ["one", 123, true] but it was only called with these parameters:\n[\n["one"]\n]`,
                    );
                });

                it('should not fail when function has been called multiple times', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);

                    expect(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true),
                    ).wasCalledAtLeastOnce();
                });

                it('should fail when function has not been called', () => {
                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true),
                        matchers.wasCalledAtLeastOnce(),
                        `Expected "functionWithParamsAndReturn" to be called with params ["one", 123, true] but it was not.`,
                    );
                });
            });

            describe('wasNotCalled()', () => {
                it('should fail when function has been called once with matching parameters', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true),
                        matchers.wasNotCalled(),
                        `Expected "functionWithParamsAndReturn" to be called 0 times with params ["one", 123, true] but it was called 1 times with matching parameters and 1 times in total.\n[\n["one",123,true]\n]`,
                    );
                });

                it('should not fail when function has been called once with different parameters', () => {
                    mock.functionWithParamsAndReturn('two', 123, true);

                    expect(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true),
                    ).wasNotCalled();
                });

                it('should fail when function has been called multiple times with matching params', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true),
                        matchers.wasNotCalled(),
                        `Expected "functionWithParamsAndReturn" to be called 0 times with params ["one", 123, true] but it was called 3 times with matching parameters and 3 times in total.\n[\n[\"one\",123,true]\n[\"one\",123,true]\n[\"one\",123,true]\n]`,
                    );
                });

                it('should not fail when function has not been called', () => {
                    expect(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true),
                    ).wasNotCalled();
                });
            });

            describe('wasCalledOnce()', () => {
                it('should not fail when function has been called once with matching parameters', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);

                    expect(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true),
                    ).wasCalledOnce();
                });

                it('should not fail when function has been called once with matching parameters and many times with other params', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);

                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    expect(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true),
                    ).wasCalledOnce();
                });

                it('should fail when function has been called multiple times', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true),
                        matchers.wasCalledOnce(),
                        `Expected "functionWithParamsAndReturn" to be called 1 times with params ["one", 123, true] but it was called 3 times with matching parameters and 3 times in total.\n[\n[\"one\",123,true]\n[\"one\",123,true]\n[\"one\",123,true]\n]`,
                    );
                });

                it('should fail when function has not been called with matching params but multiple times with other params', () => {
                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true),
                        matchers.wasCalledOnce(),
                        `Expected "functionWithParamsAndReturn" to be called 1 times with params ["one", 123, true] but it was called 0 times with matching parameters and 3 times in total.\n[\n[\"two\",123,true]\n[\"one\",456,true]\n[\"one\",456,false]\n]`,
                    );
                });
            });

            describe('wasCalled(2)', () => {
                it('should fail when function has been called once with correct parameters', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);

                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true),
                        matchers.wasCalled(),
                        `Expected "functionWithParamsAndReturn" to be called 2 times with params ["one", 123, true] but it was called 1 times with matching parameters and 4 times in total.\n[\n[\"one\",123,true]\n[\"two\",123,true]\n[\"one\",456,true]\n[\"one\",456,false]\n]`,
                        2,
                    );
                });

                it('should fail when function has been called twice with incorrect params', () => {
                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true),
                        matchers.wasCalled(),
                        `Expected "functionWithParamsAndReturn" to be called 2 times with params ["one", 123, true] but it was called 0 times with matching parameters and 2 times in total.\n[\n[\"two\",123,true]\n[\"one\",456,true]\n]`,
                        2,
                    );
                });

                it('should not fail when function has been called twice with correct params and multiple times with different params', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);

                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    expect(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true),
                    ).wasCalled(2);
                });

                it('should fail when function has been called multiple times with matching params', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true),
                        matchers.wasCalled(),
                        `Expected "functionWithParamsAndReturn" to be called 2 times with params ["one", 123, true] but it was called 3 times with matching parameters and 3 times in total.\n[\n[\"one\",123,true]\n[\"one\",123,true]\n[\"one\",123,true]\n]`,
                        2,
                    );
                });

                it('should fail when function has not been called with matching params but has been called with different params', () => {
                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true),
                        matchers.wasCalled(),
                        `Expected "functionWithParamsAndReturn" to be called 2 times with params ["one", 123, true] but it was called 0 times with matching parameters and 3 times in total.\n[\n[\"two\",123,true]\n[\"one\",456,true]\n[\"one\",456,false]\n]`,
                        2,
                    );
                });
            });
        });

        describe('assertion with params and explicit', () => {
            beforeEach(() => {
                mocked.setup(setupFunction('functionWithParamsAndReturn'));
            });

            describe('wasNotCalled()', () => {
                it('should fail when function has been called once with matching parameters', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true).strict(),
                        matchers.wasNotCalled(),
                        `Expected "functionWithParamsAndReturn" to be called 0 times with params ["one", 123, true] and 0 times with any other parameters but it was called 1 times with matching parameters and 1 times in total.\n[\n["one",123,true]\n]`,
                    );
                });

                it('should fail when function has been called once with different parameters', () => {
                    mock.functionWithParamsAndReturn('two', 123, true);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true).strict(),
                        matchers.wasNotCalled(),
                        `Expected "functionWithParamsAndReturn" to be called 0 times with params ["one", 123, true] and 0 times with any other parameters but it was called 0 times with matching parameters and 1 times in total.\n[\n["two",123,true]\n]`,
                    );
                });

                it('should fail when function has been called multiple times with matching params', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true).strict(),
                        matchers.wasNotCalled(),
                        `Expected "functionWithParamsAndReturn" to be called 0 times with params ["one", 123, true] and 0 times with any other parameters but it was called 3 times with matching parameters and 3 times in total.\n[\n[\"one\",123,true]\n[\"one\",123,true]\n[\"one\",123,true]\n]`,
                    );
                });

                it('should not fail when function has not been called', () => {
                    expect(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true).strict(),
                    ).wasNotCalled();
                });
            });

            describe('wasCalledOnce()', () => {
                it('should not fail when function has been called once with matching parameters', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);

                    expect(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true).strict(),
                    ).wasCalledOnce();
                });

                it('should fail when function has been called once with matching parameters and many times with other params', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);

                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true).strict(),
                        matchers.wasCalledOnce(),
                        `Expected "functionWithParamsAndReturn" to be called 1 times with params ["one", 123, true] and 0 times with any other parameters but it was called 1 times with matching parameters and 4 times in total.\n[\n[\"one\",123,true]\n[\"two\",123,true]\n[\"one\",456,true]\n[\"one\",456,false]\n]`,
                    );
                });

                it('should fail when function has been called multiple times', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true).strict(),
                        matchers.wasCalledOnce(),
                        `Expected "functionWithParamsAndReturn" to be called 1 times with params ["one", 123, true] and 0 times with any other parameters but it was called 3 times with matching parameters and 3 times in total.\n[\n[\"one\",123,true]\n[\"one\",123,true]\n[\"one\",123,true]\n]`,
                    );
                });

                it('should fail when function has not been called with matching params but multiple times with other params', () => {
                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true).strict(),
                        matchers.wasCalledOnce(),
                        `Expected "functionWithParamsAndReturn" to be called 1 times with params ["one", 123, true] and 0 times with any other parameters but it was called 0 times with matching parameters and 3 times in total.\n[\n[\"two\",123,true]\n[\"one\",456,true]\n[\"one\",456,false]\n]`,
                    );
                });
            });

            describe('wasCalled(2)', () => {
                it('should fail when function has been called once with correct parameters', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);

                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true).strict(),
                        matchers.wasCalled(),
                        `Expected "functionWithParamsAndReturn" to be called 2 times with params ["one", 123, true] and 0 times with any other parameters but it was called 1 times with matching parameters and 4 times in total.\n[\n[\"one\",123,true]\n[\"two\",123,true]\n[\"one\",456,true]\n[\"one\",456,false]\n]`,
                        2,
                    );
                });

                it('should fail when function has been called twice with incorrect params', () => {
                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true).strict(),
                        matchers.wasCalled(),
                        `Expected "functionWithParamsAndReturn" to be called 2 times with params ["one", 123, true] and 0 times with any other parameters but it was called 0 times with matching parameters and 2 times in total.\n[\n[\"two\",123,true]\n[\"one\",456,true]\n]`,
                        2,
                    );
                });

                it('should fail when function has been called twice with correct params and multiple times with different params', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);

                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true).strict(),
                        matchers.wasCalled(),
                        `Expected "functionWithParamsAndReturn" to be called 2 times with params ["one", 123, true] and 0 times with any other parameters but it was called 2 times with matching parameters and 5 times in total.\n[\n[\"one\",123,true]\n[\"one\",123,true]\n[\"two\",123,true]\n[\"one\",456,true]\n[\"one\",456,false]\n]`,
                        2,
                    );
                });

                it('should fail when function has been called multiple times with matching params', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true).strict(),
                        matchers.wasCalled(),
                        `Expected "functionWithParamsAndReturn" to be called 2 times with params ["one", 123, true] and 0 times with any other parameters but it was called 3 times with matching parameters and 3 times in total.\n[\n[\"one\",123,true]\n[\"one\",123,true]\n[\"one\",123,true]\n]`,
                        2,
                    );
                });

                it('should fail when function has not been called with matching params but has been called with different params', () => {
                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true).strict(),
                        matchers.wasCalled(),
                        `Expected "functionWithParamsAndReturn" to be called 2 times with params ["one", 123, true] and 0 times with any other parameters but it was called 0 times with matching parameters and 3 times in total.\n[\n[\"two\",123,true]\n[\"one\",456,true]\n[\"one\",456,false]\n]`,
                        2,
                    );
                });

                it('should count function calls the same regardless of called via mock or constructor', () => {
                    const constructedInstace = new mocked.mockConstructor({}, new Date());

                    constructedInstace.functionWithParamsAndReturn('one', 123, true);

                    mock.functionWithParamsAndReturn('two', 123, true);
                    constructedInstace.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true).strict(),
                        matchers.wasCalled(),
                        `Expected "functionWithParamsAndReturn" to be called 2 times with params ["one", 123, true] and 0 times with any other parameters but it was called 1 times with matching parameters and 4 times in total.\n[\n[\"one\",123,true]\n[\"two\",123,true]\n[\"one\",456,true]\n[\"one\",456,false]\n]`,
                        2,
                    );
                });
            });
        });
    });

    describe('withGetter', () => {
        it('called directly on mock instance', () => {
            mocked.setup(setupProperty('propertyOne'));

            get(mock.propertyOne);

            expect(mocked.withGetter('propertyOne')).wasCalledAtLeastOnce();
        });

        it('called on checker returned from setup function', () => {
            const verifier = mocked.setupProperty('propertyOne');

            get(mock.propertyOne);

            expect(verifier).wasCalledAtLeastOnce();
        });

        describe('call count assertion', () => {
            beforeEach(() => {
                mocked.setup(setupProperty('propertyOne'));
            });

            describe('wasCalledAtLeastOnce()', () => {
                it('should not fail when getter has been called once', () => {
                    get(mock.propertyOne);

                    expect(mocked.withGetter('propertyOne')).wasCalledAtLeastOnce();
                });

                it('should not fail when getter has been called multiple times', () => {
                    get(mock.propertyOne);
                    get(mock.propertyOne);
                    get(mock.propertyOne);

                    expect(mocked.withGetter('propertyOne')).wasCalledAtLeastOnce();
                });

                it('should fail when getter has not been called', () => {
                    verifyFailure(
                        mocked.withGetter('propertyOne'),
                        matchers.wasCalledAtLeastOnce(),
                        `Expected property "propertyOne" getter to be called but it was not.`,
                    );
                });
            });

            describe('wasNotCalled()', () => {
                it('should fail when getter has been called once', () => {
                    get(mock.propertyOne);

                    verifyFailure(
                        mocked.withGetter('propertyOne'),
                        matchers.wasNotCalled(),
                        `Expected property "propertyOne" getter to be called 0 times but it was called 1 times with matching parameters and 1 times in total.`,
                    );
                });

                it('should fail when getter has been called multiple times', () => {
                    get(mock.propertyOne);
                    get(mock.propertyOne);
                    get(mock.propertyOne);

                    verifyFailure(
                        mocked.withGetter('propertyOne'),
                        matchers.wasNotCalled(),
                        `Expected property "propertyOne" getter to be called 0 times but it was called 3 times with matching parameters and 3 times in total.`,
                    );
                });

                it('should not fail when getter has not been called', () => {
                    expect(mocked.withGetter('propertyOne')).wasNotCalled();
                });
            });

            describe('wasCalled(0)', () => {
                it('should fail when getter has been called once', () => {
                    get(mock.propertyOne);

                    verifyFailure(
                        mocked.withGetter('propertyOne'),
                        matchers.wasCalled(),
                        `Expected property "propertyOne" getter to be called 0 times but it was called 1 times with matching parameters and 1 times in total.`,
                        0,
                    );
                });

                it('should fail when getter has been called multiple times', () => {
                    get(mock.propertyOne);
                    get(mock.propertyOne);
                    get(mock.propertyOne);

                    verifyFailure(
                        mocked.withGetter('propertyOne'),
                        matchers.wasCalled(),
                        `Expected property "propertyOne" getter to be called 0 times but it was called 3 times with matching parameters and 3 times in total.`,
                        0,
                    );
                });

                it('should not fail when getter has not been called', () => {
                    expect(mocked.withGetter('propertyOne')).wasCalled(0);
                });
            });

            describe('wasCalledOnce', () => {
                it('should not fail when getter has been called once', () => {
                    get(mock.propertyOne);

                    expect(mocked.withGetter('propertyOne')).wasCalledOnce();
                });

                it('should fail when getter has been called multiple times', () => {
                    get(mock.propertyOne);
                    get(mock.propertyOne);
                    get(mock.propertyOne);

                    verifyFailure(
                        mocked.withGetter('propertyOne'),
                        matchers.wasCalledOnce(),
                        `Expected property "propertyOne" getter to be called 1 times but it was called 3 times with matching parameters and 3 times in total.`,
                    );
                });

                it('should fail when getter has not been called', () => {
                    verifyFailure(
                        mocked.withGetter('propertyOne'),
                        matchers.wasCalledOnce(),
                        `Expected property "propertyOne" getter to be called 1 times but it was called 0 times with matching parameters and 0 times in total.`,
                    );
                });
            });

            describe('wasCalled(1)', () => {
                it('should not fail when getter has been called once', () => {
                    get(mock.propertyOne);

                    expect(mocked.withGetter('propertyOne')).wasCalled(1);
                });

                it('should fail when getter has been called multiple times', () => {
                    get(mock.propertyOne);
                    get(mock.propertyOne);
                    get(mock.propertyOne);

                    verifyFailure(
                        mocked.withGetter('propertyOne'),
                        matchers.wasCalled(),
                        `Expected property "propertyOne" getter to be called 1 times but it was called 3 times with matching parameters and 3 times in total.`,
                        1,
                    );
                });

                it('should fail when getter has not been called', () => {
                    verifyFailure(
                        mocked.withGetter('propertyOne'),
                        matchers.wasCalled(),
                        `Expected property "propertyOne" getter to be called 1 times but it was called 0 times with matching parameters and 0 times in total.`,
                        1,
                    );
                });
            });

            describe('wasCalled(2)', () => {
                it('should fail when getter has been called once', () => {
                    get(mock.propertyOne);

                    verifyFailure(
                        mocked.withGetter('propertyOne'),
                        matchers.wasCalled(),
                        `Expected property "propertyOne" getter to be called 2 times but it was called 1 times with matching parameters and 1 times in total.`,
                        2,
                    );
                });

                it('should not fail when getter has been called twice', () => {
                    get(mock.propertyOne);
                    get(mock.propertyOne);

                    expect(mocked.withGetter('propertyOne')).wasCalled(2);
                });

                it('should fail when getter has been called multiple times', () => {
                    get(mock.propertyOne);
                    get(mock.propertyOne);
                    get(mock.propertyOne);

                    verifyFailure(
                        mocked.withGetter('propertyOne'),
                        matchers.wasCalled(),
                        `Expected property "propertyOne" getter to be called 2 times but it was called 3 times with matching parameters and 3 times in total.`,
                        2,
                    );
                });

                it('should count function calls the same regardless of called via mock or constructor', () => {
                    const constructedInstance = new mocked.mockConstructor({}, new Date());

                    get(mock.propertyOne);
                    get(constructedInstance.propertyOne);
                    get(mock.propertyOne);

                    verifyFailure(
                        mocked.withGetter('propertyOne'),
                        matchers.wasCalled(),
                        `Expected property "propertyOne" getter to be called 2 times but it was called 3 times with matching parameters and 3 times in total.`,
                        2,
                    );
                });

                it('should fail when getter has not been called', () => {
                    verifyFailure(
                        mocked.withGetter('propertyOne'),
                        matchers.wasCalled(),
                        `Expected property "propertyOne" getter to be called 2 times but it was called 0 times with matching parameters and 0 times in total.`,
                        2,
                    );
                });
            });
        });
    });

    describe('defineProperty', () => {
        it('called directly on mock instance', () => {
            mocked.setup(defineProperty('propertyOne'));

            get(mock.propertyOne);

            expect(mocked.withGetter('propertyOne')).wasCalledAtLeastOnce();
        });

        it('called on checker returned from setup function', () => {
            const verifier = mocked.defineProperty('propertyOne');

            get(mock.propertyOne);

            expect(verifier).wasCalledAtLeastOnce();
        });
    });

    describe('withSetter', () => {
        describe('assertion with parameters', () => {
            beforeEach(() => {
                mocked.setup(defineProperty('propertyOne'));
            });

            describe('wasCalledAtLeastOnce()', () => {
                it('should not fail when function has been called once with matching params', () => {
                    mock.propertyOne = 'one';

                    expect(mocked.withSetter('propertyOne').withParameters('one')).wasCalledAtLeastOnce();
                });

                it(`should fail when function has been called once with "two" instead of "one"`, () => {
                    mock.propertyOne = 'two';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one'),
                        matchers.wasCalledAtLeastOnce(),
                        `Expected property "propertyOne" to be set with params ["one"] but it was only called with these parameters:\n[\n["two"]\n]`,
                    );
                });

                it('should not fail when function has been called multiple times', () => {
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';

                    expect(mocked.withSetter('propertyOne').withParameters('one')).wasCalledAtLeastOnce();
                });

                it('should fail when function has not been called', () => {
                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one'),
                        matchers.wasCalledAtLeastOnce(),
                        `Expected property "propertyOne" to be set with params ["one"] but it was not.`,
                    );
                });
            });

            describe('wasNotCalled()', () => {
                it('should fail when function has been called once with matching parameters', () => {
                    mock.propertyOne = 'one';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one'),
                        matchers.wasNotCalled(),
                        `Expected property "propertyOne" to be set 0 times with params ["one"] but it was called 1 times with matching parameters and 1 times in total.\n[\n["one"]\n]`,
                    );
                });

                it('should not fail when function has been called once with different parameters', () => {
                    mock.propertyOne = 'one';

                    expect(mocked.withSetter('propertyOne').withParameters('two')).wasNotCalled();
                });

                it('should fail when function has been called multiple times with matching params', () => {
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one'),
                        matchers.wasNotCalled(),
                        `Expected property "propertyOne" to be set 0 times with params ["one"] but it was called 3 times with matching parameters and 3 times in total.\n[\n[\"one\"]\n[\"one\"]\n[\"one\"]\n]`,
                    );
                });

                it('should not fail when function has not been called', () => {
                    expect(mocked.withSetter('propertyOne').withParameters('one')).wasNotCalled();
                });
            });

            describe('wasCalledOnce()', () => {
                it('should not fail when function has been called once with matching parameters', () => {
                    mock.propertyOne = 'one';

                    expect(mocked.withSetter('propertyOne').withParameters('one')).wasCalledOnce();
                });

                it('should not fail when function has been called once with matching parameters and many times with other params', () => {
                    mock.propertyOne = 'one';

                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';
                    mock.propertyOne = 'four';

                    expect(mocked.withSetter('propertyOne').withParameters('one')).wasCalledOnce();
                });

                it('should fail when function has been called multiple times', () => {
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one'),
                        matchers.wasCalledOnce(),
                        `Expected property "propertyOne" to be set 1 times with params ["one"] but it was called 3 times with matching parameters and 3 times in total.\n[\n[\"one\"]\n[\"one\"]\n[\"one\"]\n]`,
                    );
                });

                it('should fail when function has not been called with matching params but multiple times with other params', () => {
                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';
                    mock.propertyOne = 'four';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one'),
                        matchers.wasCalledOnce(),
                        `Expected property "propertyOne" to be set 1 times with params ["one"] but it was called 0 times with matching parameters and 3 times in total.\n[\n[\"two\"]\n[\"three\"]\n[\"four\"]\n]`,
                    );
                });
            });

            describe('wasCalled(2)', () => {
                it('should fail when function has been called once with correct parameters', () => {
                    mock.propertyOne = 'one';

                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';
                    mock.propertyOne = 'four';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one'),
                        matchers.wasCalled(),
                        `Expected property "propertyOne" to be set 2 times with params ["one"] but it was called 1 times with matching parameters and 4 times in total.\n[\n[\"one\"]\n[\"two\"]\n[\"three\"]\n[\"four\"]\n]`,
                        2,
                    );
                });

                it('should fail when function has been called twice with incorrect params', () => {
                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one'),
                        matchers.wasCalled(),
                        `Expected property "propertyOne" to be set 2 times with params ["one"] but it was called 0 times with matching parameters and 2 times in total.\n[\n[\"two\"]\n[\"three\"]\n]`,
                        2,
                    );
                });

                it('should not fail when function has been called twice with correct params and multiple times with different params', () => {
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';

                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';
                    mock.propertyOne = 'four';

                    expect(mocked.withSetter('propertyOne').withParameters('one')).wasCalled(2);
                });

                it('should fail when function has been called multiple times with matching params', () => {
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one'),
                        matchers.wasCalled(),
                        `Expected property "propertyOne" to be set 2 times with params ["one"] but it was called 3 times with matching parameters and 3 times in total.\n[\n[\"one\"]\n[\"one\"]\n[\"one\"]\n]`,
                        2,
                    );
                });

                it('should fail when function has not been called with matching params but has been called with different params', () => {
                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';
                    mock.propertyOne = 'four';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one'),
                        matchers.wasCalled(),
                        `Expected property "propertyOne" to be set 2 times with params ["one"] but it was called 0 times with matching parameters and 3 times in total.\n[\n[\"two\"]\n[\"three\"]\n[\"four\"]\n]`,
                        2,
                    );
                });
            });
        });

        describe('assertion with params and explicit', () => {
            beforeEach(() => {
                mocked.setup(setupProperty('propertyOne'));
            });

            describe('wasNotCalled()', () => {
                it('should fail when function has been called once with matching parameters', () => {
                    mock.propertyOne = 'one';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one').strict(),
                        matchers.wasNotCalled(),
                        `Expected property "propertyOne" to be set 0 times with params ["one"] and 0 times with any other parameters but it was called 1 times with matching parameters and 1 times in total.\n[\n["one"]\n]`,
                    );
                });

                it('should fail when function has been called once with different parameters', () => {
                    mock.propertyOne = 'two';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one').strict(),
                        matchers.wasNotCalled(),
                        `Expected property "propertyOne" to be set 0 times with params ["one"] and 0 times with any other parameters but it was called 0 times with matching parameters and 1 times in total.\n[\n["two"]\n]`,
                    );
                });

                it('should fail when function has been called multiple times with matching params', () => {
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one').strict(),
                        matchers.wasNotCalled(),
                        `Expected property "propertyOne" to be set 0 times with params ["one"] and 0 times with any other parameters but it was called 3 times with matching parameters and 3 times in total.\n[\n[\"one\"]\n[\"one\"]\n[\"one\"]\n]`,
                    );
                });

                it('should count function calls the same regardless of called via mock or constructor', () => {
                    const constructedInstance = new mocked.mockConstructor({}, new Date());

                    mock.propertyOne = 'one';
                    constructedInstance.propertyOne = 'one';
                    mock.propertyOne = 'one';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one').strict(),
                        matchers.wasNotCalled(),
                        `Expected property "propertyOne" to be set 0 times with params ["one"] and 0 times with any other parameters but it was called 3 times with matching parameters and 3 times in total.\n[\n[\"one\"]\n[\"one\"]\n[\"one\"]\n]`,
                    );
                });

                it('should not fail when function has not been called', () => {
                    expect(mocked.withSetter('propertyOne').withParameters('one').strict()).wasNotCalled();
                });
            });

            describe('wasCalledOnce()', () => {
                it('should not fail when function has been called once with matching parameters', () => {
                    mock.propertyOne = 'one';

                    expect(mocked.withSetter('propertyOne').withParameters('one').strict()).wasCalledOnce();
                });

                it('should fail when function has been called once with matching parameters and many times with other params', () => {
                    mock.propertyOne = 'one';

                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';
                    mock.propertyOne = 'four';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one').strict(),
                        matchers.wasCalledOnce(),
                        `Expected property "propertyOne" to be set 1 times with params ["one"] and 0 times with any other parameters but it was called 1 times with matching parameters and 4 times in total.\n[\n[\"one\"]\n[\"two\"]\n[\"three\"]\n[\"four\"]\n]`,
                    );
                });

                it('should fail when function has been called multiple times', () => {
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one').strict(),
                        matchers.wasCalledOnce(),
                        `Expected property "propertyOne" to be set 1 times with params ["one"] and 0 times with any other parameters but it was called 3 times with matching parameters and 3 times in total.\n[\n[\"one\"]\n[\"one\"]\n[\"one\"]\n]`,
                    );
                });

                it('should fail when function has not been called with matching params but multiple times with other params', () => {
                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';
                    mock.propertyOne = 'four';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one').strict(),
                        matchers.wasCalledOnce(),
                        `Expected property "propertyOne" to be set 1 times with params ["one"] and 0 times with any other parameters but it was called 0 times with matching parameters and 3 times in total.\n[\n[\"two\"]\n[\"three\"]\n[\"four\"]\n]`,
                    );
                });
            });

            describe('wasCalled(2)', () => {
                it('should fail when function has been called once with correct parameters', () => {
                    mock.propertyOne = 'one';

                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';
                    mock.propertyOne = 'four';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one').strict(),
                        matchers.wasCalled(),
                        `Expected property "propertyOne" to be set 2 times with params ["one"] and 0 times with any other parameters but it was called 1 times with matching parameters and 4 times in total.\n[\n[\"one\"]\n[\"two\"]\n[\"three\"]\n[\"four\"]\n]`,
                        2,
                    );
                });

                it('should fail when function has been called twice with incorrect params', () => {
                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one').strict(),
                        matchers.wasCalled(),
                        `Expected property "propertyOne" to be set 2 times with params ["one"] and 0 times with any other parameters but it was called 0 times with matching parameters and 2 times in total.\n[\n[\"two\"]\n[\"three\"]\n]`,
                        2,
                    );
                });

                it('should fail when function has been called twice with correct params and multiple times with different params', () => {
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';

                    mock.propertyOne = 'three';
                    mock.propertyOne = 'four';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one').strict(),
                        matchers.wasCalled(),
                        `Expected property "propertyOne" to be set 2 times with params ["one"] and 0 times with any other parameters but it was called 2 times with matching parameters and 4 times in total.\n[\n[\"one\"]\n[\"one\"]\n[\"three\"]\n[\"four\"]\n]`,
                        2,
                    );
                });

                it('should fail when function has been called multiple times with matching params', () => {
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one').strict(),
                        matchers.wasCalled(),
                        `Expected property "propertyOne" to be set 2 times with params ["one"] and 0 times with any other parameters but it was called 3 times with matching parameters and 3 times in total.\n[\n[\"one\"]\n[\"one\"]\n[\"one\"]\n]`,
                        2,
                    );
                });

                it('should fail when function has not been called with matching params but has been called with different params', () => {
                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';
                    mock.propertyOne = 'four';

                    verifyFailure(
                        mocked.withSetter('propertyOne').withParameters('one').strict(),
                        matchers.wasCalled(),
                        `Expected property "propertyOne" to be set 2 times with params ["one"] and 0 times with any other parameters but it was called 0 times with matching parameters and 3 times in total.\n[\n[\"two\"]\n[\"three\"]\n[\"four\"]\n]`,
                        2,
                    );
                });
            });
        });
    });

    describe('mockedProperties', () => {
        it('should not be set before setup is called', () => {
            expect(mock.propertyOne).toBeUndefined();
        });

        it('should be set after setupProperty is called', () => {
            mocked.setup(setupProperty('propertyOne', 'mockedValue'));

            expect(mock.propertyOne).toEqual('mockedValue');
        });

        it('should be set after boolean property is set to true', () => {
            mocked.setup(setupProperty('propertyThree', true));

            expect(mock.propertyThree).toBeDefined();
            expect(mock.propertyThree).toEqual(true);
        });

        it('should be set after boolean property is set to false', () => {
            mocked.setup(setupProperty('propertyThree', false));

            expect(mock.propertyThree).toBeDefined();
            expect(mock.propertyThree).toEqual(false);
        });

        it('should be updated after setupProperty is called a second time', () => {
            mocked.setup(setupProperty('propertyOne', 'mockedValue'));
            mocked.setup(setupProperty('propertyOne', 'changedValue'));

            expect(mock.propertyOne).toEqual('changedValue');
        });

        it('should be set after defineProperty is called', () => {
            let mockedValue = 'mockedValue';

            mocked.setup(defineProperty('propertyOne', () => mockedValue));

            expect(mock.propertyOne).toEqual('mockedValue');

            mockedValue = 'changed';

            expect(mock.propertyOne).toEqual('changed');
        });

        it('should call a setter when property set if one was defined', () => {
            const values: string[] = [];

            function setter(value: string) {
                values.push(value);
            }

            mocked.setup(defineProperty('propertyOne', () => 'mockedValue', setter));

            expect(values).toEqual([]);
            mocked.mock.propertyOne = 'testOne';
            expect(values).toEqual(['testOne']);
            mocked.mock.propertyOne = 'testTwo';
            expect(values).toEqual(['testOne', 'testTwo']);
        });

        it('should not change setter on mock when defineProperty called twice', () => {
            const values: string[] = [];

            function setterOne(value: string) {
                values.push(`${value}_setterOne`);
            }

            function setterTwo(value: string) {
                values.push(`${value}_setterTwo`);
            }

            mocked.setup(defineProperty('propertyOne', () => 'mockedValue'));
            let mockedFunction = Object.getOwnPropertyDescriptor(mock, 'propertyOne')?.set;

            mocked.setup(defineProperty('propertyOne', () => 'mockedValue', setterOne));
            expect(Object.getOwnPropertyDescriptor(mock, 'propertyOne')?.set).toBe(mockedFunction);
            mockedFunction = Object.getOwnPropertyDescriptor(mock, 'propertyOne')?.set;

            mocked.setup(defineProperty('propertyOne', () => 'mockedValue', setterTwo));
            expect(Object.getOwnPropertyDescriptor(mock, 'propertyOne')?.set).toBe(mockedFunction);
            expect(values).toEqual([]);
            mocked.mock.propertyOne = 'testOne';
            expect(values).toEqual(['testOne_setterTwo']);
        });

        it('should not change getter on mock when defineProperty called twice', () => {
            function getterOne() {
                return 'getterOne';
            }

            function getterTwo() {
                return 'getterTwo';
            }

            mocked.setup(defineProperty('propertyOne'));
            let mockedFunction = Object.getOwnPropertyDescriptor(mock, 'propertyOne')?.get;

            mocked.setup(defineProperty('propertyOne', getterOne));
            expect(Object.getOwnPropertyDescriptor(mock, 'propertyOne')?.get).toBe(mockedFunction);
            mockedFunction = Object.getOwnPropertyDescriptor(mock, 'propertyOne')?.get;

            mocked.setup(defineProperty('propertyOne', getterTwo));
            expect(Object.getOwnPropertyDescriptor(mock, 'propertyOne')?.get).toBe(mockedFunction);
            expect(mocked.mock.propertyOne).toEqual('getterTwo');
        });
    });

    describe('mockedFunctions', () => {
        it('should not be defined on the mock before setup is called', () => {
            expect(mock.functionWithNoParamsAndReturnType).toBeUndefined();
        });

        it('should return undefined when a mocked function is called after setup with no mock implementation passed', () => {
            mocked.setup(setupFunction('functionWithNoParamsAndReturnType'));

            expect(mock.functionWithNoParamsAndReturnType()).toBeUndefined();
        });

        it('should return mocked implementation return value when a mocked function is called after setup with mock implementation passed', () => {
            function mockFunction(paramOne: string, paramTwo?: number, paramThree?: boolean) {
                return `mockedReturnValue_${paramOne}_${paramTwo}_${paramThree}`;
            }

            mocked.setup(setupFunction('functionWithParamsAndReturn', mockFunction));

            expect(mock.functionWithParamsAndReturn('one', 2, true)).toEqual('mockedReturnValue_one_2_true');
        });

        it('should changed implementation when setupFunction called a second time', () => {
            function mockFunctionOne() {
                return `mockFunctionOneReturnValue`;
            }

            function mockFunctionTwo() {
                return `mockFunctionTwoReturnValue`;
            }

            mocked.setup(setupFunction('functionWithParamsAndReturn', mockFunctionOne));
            mocked.setup(setupFunction('functionWithParamsAndReturn', mockFunctionTwo));

            expect(mock.functionWithParamsAndReturn('one', 2, true)).toEqual('mockFunctionTwoReturnValue');
        });

        it('should not change function object on mock when setupFunction called twice', () => {
            // underlying function should change but mock function should not
            // this is to avoid issues when function is imported once and we change implementation after initial setup

            function mockFunctionOne() {
                return `mockFunctionOneReturnValue`;
            }

            function mockFunctionTwo() {
                return `mockFunctionTwoReturnValue`;
            }

            mocked.setup(setupFunction('functionWithParamsAndReturn'));
            let mockedFunction = mock.functionWithParamsAndReturn;

            mocked.setup(setupFunction('functionWithParamsAndReturn', mockFunctionOne));
            expect(mock.functionWithParamsAndReturn).toBe(mockedFunction);
            mockedFunction = mock.functionWithParamsAndReturn;

            mocked.setup(setupFunction('functionWithParamsAndReturn', mockFunctionTwo));
            expect(mock.functionWithParamsAndReturn).toBe(mockedFunction);
            expect(mock.functionWithParamsAndReturn('one', 2, true)).toEqual('mockFunctionTwoReturnValue');
        });

        it('chaining setup functions should be supported', () => {
            const newMock = Mock.create<SampleMockedClass>().setup(
                setupFunction('functionWithNoParamsAndNoReturn'),
                setupFunction('functionWithNoParamsAndReturnType'),
                setupFunction('functionWithParamsAndNoReturn'),
                setupFunction('functionWithParamsAndReturn'),
            ).mock;

            expect(newMock.functionWithNoParamsAndNoReturn()).toBeUndefined();
            expect(newMock.functionWithNoParamsAndReturnType()).toBeUndefined();
            expect(newMock.functionWithParamsAndNoReturn('', 123, true)).toBeUndefined();
            expect(newMock.functionWithParamsAndReturn('')).toBeUndefined();
        });
    });

    describe('parameter comparison', () => {
        let objectOne: { one: string; two: number };
        let objectTwo: { one: string; two: number };

        beforeEach(() => {
            objectOne = { one: 'one', two: 2 };
            objectTwo = { ...objectOne };

            mocked.setup(
                setupFunction('functionWithComplexParam'),
                setupFunction('functionWithCallback'),
                setupFunction('functionWithParamsAndReturn'),
            );
        });

        describe('withParameters', () => {
            it('should pass when same object is passed (strictly equal)', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(
                    mocked.withFunction('functionWithComplexParam').withParameters(objectOne, 'two', 3),
                ).wasCalledOnce();
            });

            it('should fail when matching but not strictly equal objects passed', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                verifyFailure(
                    mocked.withFunction('functionWithComplexParam').withParameters(objectTwo, 'two', 3),
                    matchers.wasCalledOnce(),
                    'Expected "functionWithComplexParam" to be called 1 times with params [{"one":"one","two":2}, "two", 3] but it was called 0 times with matching parameters and 1 times in total.\n[\n[{"one":"one","two":2},"two",3]\n]',
                );
            });

            it('should fail when non matching parameters passed', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                verifyFailure(
                    mocked.withFunction('functionWithComplexParam').withParameters(objectOne, 'three', 4),
                    matchers.wasCalledOnce(),
                    'Expected "functionWithComplexParam" to be called 1 times with params [{"one":"one","two":2}, "three", 4] but it was called 0 times with matching parameters and 1 times in total.\n[\n[{"one":"one","two":2},"two",3]\n]',
                );
            });

            it('should fail when fewer parameters passed', () => {
                mock.functionWithComplexParam(objectOne, 'two');

                verifyFailure(
                    mocked.withFunction('functionWithComplexParam').withParameters(objectOne, 'two', 3),
                    matchers.wasCalledOnce(),
                    'Expected "functionWithComplexParam" to be called 1 times with params [{"one":"one","two":2}, "two", 3] but it was called 0 times with matching parameters and 1 times in total.\n[\n[{"one":"one","two":2},"two"]\n]',
                );
            });

            it('should fail when extra parameters passed', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                matchers.wasCalledOnce();

                verifyFailure(
                    mocked.withFunction('functionWithComplexParam').withParameters(objectOne, 'two'),
                    matchers.wasCalledOnce(),
                    'Expected "functionWithComplexParam" to be called 1 times with params [{"one":"one","two":2}, "two"] but it was called 0 times with matching parameters and 1 times in total.\n[\n[{"one":"one","two":2},"two",3]\n]',
                );
            });

            it('should fail when custom matchers used', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                verifyFailure(
                    mocked.withFunction('functionWithComplexParam').withParameters(any(), () => false, {
                        isExpectedValue: () => false,
                        expectedDisplayValue: 'customMatcher',
                        parameterToString: (value: any) => `customMatcher_${value}`,
                    }),
                    matchers.wasCalledOnce(),
                    'Expected "functionWithComplexParam" to be called 1 times with params [<matchAny>, <customParameterMatchFunction>, customMatcher] but it was called 0 times with matching parameters and 1 times in total.\n[\n[{"one":"one","two":2},"two",<customMatcher_3>]\n]',
                );
            });
        });

        describe('withParametersEqualTo', () => {
            it('should pass when same object is passed (strictly equal)', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(
                    mocked.withFunction('functionWithComplexParam').withParametersEqualTo(objectOne, 'two', 3),
                ).wasCalledOnce();
            });

            it('should pass when matching but not strictly equal objects passed', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(
                    mocked.withFunction('functionWithComplexParam').withParametersEqualTo(objectTwo, 'two', 3),
                ).wasCalledOnce();
            });

            it('should fail when non matching parameters passed', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                verifyFailure(
                    mocked.withFunction('functionWithComplexParam').withParametersEqualTo(objectOne, 'three', 4),
                    matchers.wasCalledOnce(),
                    'Expected "functionWithComplexParam" to be called 1 times with params [{"one":"one","two":2}, "three", 4] but it was called 0 times with matching parameters and 1 times in total.\n[\n[{"one":"one","two":2},"two",3]\n]',
                );
            });

            it('should fail when fewer parameters passed', () => {
                mock.functionWithComplexParam(objectOne, 'two');

                verifyFailure(
                    mocked.withFunction('functionWithComplexParam').withParametersEqualTo(objectOne, 'two', 3),
                    matchers.wasCalledOnce(),
                    'Expected "functionWithComplexParam" to be called 1 times with params [{"one":"one","two":2}, "two", 3] but it was called 0 times with matching parameters and 1 times in total.\n[\n[{"one":"one","two":2},"two"]\n]',
                );
            });

            it('should fail when extra parameters passed', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                verifyFailure(
                    mocked.withFunction('functionWithComplexParam').withParametersEqualTo(objectOne, 'two'),
                    matchers.wasCalledOnce(),
                    'Expected "functionWithComplexParam" to be called 1 times with params [{"one":"one","two":2}, "two"] but it was called 0 times with matching parameters and 1 times in total.\n[\n[{"one":"one","two":2},"two",3]\n]',
                );
            });
        });

        describe('customMatchers', () => {
            it('should pass when toBeDefined matcher used', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(toBeDefined(), toBeDefined(), toBeDefined()),
                ).wasCalledOnce();
            });

            it('should pass when toBeDefined matcher used with null', () => {
                mock.functionWithComplexParam(null!, null!, null!);

                expect(
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(toBeDefined(), toBeDefined(), toBeDefined()),
                ).wasCalledOnce();
            });

            it('should fail when toBeDefined matcher used with undefined', () => {
                mock.functionWithComplexParam(undefined!, undefined!, undefined!);

                verifyFailure(
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(toBeDefined(), toBeDefined(), toBeDefined()),
                    matchers.wasCalledOnce(),
                    'Expected "functionWithComplexParam" to be called 1 times with params [<mustBeDefined>, <mustBeDefined>, <mustBeDefined>] but it was called 0 times with matching parameters and 1 times in total.\n[\n[undefined,undefined,undefined]\n]',
                );
            });

            it('should fail when hasValue matcher used with null', () => {
                mock.functionWithComplexParam(null!, null!, null!);

                verifyFailure(
                    mocked.withFunction('functionWithComplexParam').withParameters(hasValue(), hasValue(), hasValue()),
                    matchers.wasCalledOnce(),
                    'Expected "functionWithComplexParam" to be called 1 times with params [<hasValue>, <hasValue>, <hasValue>] but it was called 0 times with matching parameters and 1 times in total.\n[\n[null,null,null]\n]',
                );
            });

            it('should fail when hasValue matcher used with undefined', () => {
                mock.functionWithComplexParam(undefined!, undefined!, undefined!);

                verifyFailure(
                    mocked.withFunction('functionWithComplexParam').withParameters(hasValue(), hasValue(), hasValue()),
                    matchers.wasCalledOnce(),
                    'Expected "functionWithComplexParam" to be called 1 times with params [<hasValue>, <hasValue>, <hasValue>] but it was called 0 times with matching parameters and 1 times in total.\n[\n[undefined,undefined,undefined]\n]',
                );
            });

            it('should pass when toBe matcher used', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(toBe(objectOne), toBe('two'), toBe(3)),
                ).wasCalledOnce();
            });

            it('should fail when toBe matcher used', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                verifyFailure(
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(toBe(objectTwo), toBe('two'), toBe(3)),
                    matchers.wasCalledOnce(),
                    'Expected "functionWithComplexParam" to be called 1 times with params [{"one":"one","two":2}, "two", 3] but it was called 0 times with matching parameters and 1 times in total.\n[\n[{"one":"one","two":2},"two",3]\n]',
                );
            });

            it('should pass when toEqual matcher used', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(toEqual(objectTwo), toEqual('two'), toEqual(3)),
                ).wasCalledOnce();
            });

            it('should fail when toEqual matcher used', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                verifyFailure(
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(toEqual(objectTwo), toEqual('two'), toEqual(4)),
                    matchers.wasCalledOnce(),
                    'Expected "functionWithComplexParam" to be called 1 times with params [{"one":"one","two":2}, "two", 4] but it was called 0 times with matching parameters and 1 times in total.\n[\n[{"one":"one","two":2},"two",3]\n]',
                );
            });

            it('should pass when any matcher used', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(
                    mocked.withFunction('functionWithComplexParam').withParameters(any(), any(), any()),
                ).wasCalledOnce();
            });

            it('should fail when any matcher used', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                verifyFailure(
                    mocked.withFunction('functionWithComplexParam').withParameters(any(), any(), toEqual(4)),
                    matchers.wasCalledOnce(),
                    'Expected "functionWithComplexParam" to be called 1 times with params [<matchAny>, <matchAny>, 4] but it was called 0 times with matching parameters and 1 times in total.\n[\n[{"one":"one","two":2},"two",3]\n]',
                );
            });

            it('should pass when toBe used with function', () => {
                const callback = () => true;
                mock.functionWithCallback(callback);

                expect(mocked.withFunction('functionWithCallback').withParameters(toBe(callback))).wasCalledOnce();
            });

            it('should fail when toBe used with function', () => {
                mock.functionWithCallback(() => true);

                verifyFailure(
                    mocked.withFunction('functionWithCallback').withParameters(toBe(() => true)),
                    matchers.wasCalledOnce(),
                    'Expected "functionWithCallback" to be called 1 times with params ["function ()"] but it was called 0 times with matching parameters and 1 times in total.\n[\n["function ()"]\n]',
                );
            });

            it('should pass with custom match function', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(
                    mocked.withFunction('functionWithComplexParam').withParameters(
                        () => true,
                        () => true,
                        () => true,
                    ),
                ).wasCalledOnce();
            });

            it('should fail with custom match function', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                verifyFailure(
                    mocked.withFunction('functionWithComplexParam').withParameters(
                        () => false,
                        () => false,
                        () => false,
                    ),
                    matchers.wasCalledOnce(),
                    'Expected "functionWithComplexParam" to be called 1 times with params [<customParameterMatchFunction>, <customParameterMatchFunction>, <customParameterMatchFunction>] but it was called 0 times with matching parameters and 1 times in total.\n[\n[{"one":"one","two":2},"two",3]\n]',
                );
            });

            function createCustomMatcher<T>(expectedValue: T | undefined): IParameterMatcher<T | undefined> {
                return {
                    isExpectedValue: (actualValue) => actualValue === expectedValue,
                    expectedDisplayValue: `customMatcherExpectedValue: ${expectedValue}`,
                    parameterToString: (value) => `customMatcherActualValue: ${value}`,
                };
            }

            it('should pass with custom matchers', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(
                            createCustomMatcher(objectOne),
                            createCustomMatcher('two'),
                            createCustomMatcher(3),
                        ),
                ).wasCalledOnce();
            });

            it('should fail with custom match function', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                verifyFailure(
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(
                            createCustomMatcher(objectTwo),
                            createCustomMatcher('two'),
                            createCustomMatcher(3),
                        ),
                    matchers.wasCalledOnce(),
                    'Expected "functionWithComplexParam" to be called 1 times with params [customMatcherExpectedValue: [object Object], customMatcherExpectedValue: two, customMatcherExpectedValue: 3] but it was called 0 times with matching parameters and 1 times in total.\n[\n[<customMatcherActualValue: [object Object]>,<customMatcherActualValue: two>,<customMatcherActualValue: 3>]\n]',
                );
            });

            it('should fail if match function does not return a boolean', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                verifyFailure(
                    mocked.withFunction('functionWithComplexParam').withParameters(
                        (value) => `incorrect return value: ${value.one}` as any,
                        () => false,
                        () => false,
                    ),
                    matchers.wasCalledOnce(),
                    `Error calling custom parameter match function. Function returned "incorrect return value: one" (typeof: string) rather than a boolean. You must use an existing IParameterMatcher (such as toBe(value)) or implement your own if you want to verify functions passed as mocked function arguments.`,
                );
            });

            it('should fail if match function throws an error', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                verifyFailure(
                    mocked.withFunction('functionWithComplexParam').withParameters(
                        () => {
                            throw new Error('Error thrown by function parameter matcher');
                        },
                        () => false,
                        () => false,
                    ),
                    matchers.wasCalledOnce(),
                    `Error: calling custom parameter match function threw an error (Error: Error thrown by function parameter matcher) rather returning a boolean. You must use an existing IParameterMatcher (such as toBe(value)) or implement your own if you want to verify functions passed as mocked function arguments.`,
                );
            });
        });

        describe('value representation in error messages', () => {
            type ErrorMessageTest = { description: string; parameter: any; errorMessage: string };
            const tests: ErrorMessageTest[] = [
                { description: 'function with no params', parameter: () => {}, errorMessage: `["function ()"]` },
                {
                    description: 'function with one param',
                    parameter: (_value: string) => {},
                    errorMessage: `["function (_value)"]`,
                },
                {
                    description: 'function with two params',
                    parameter: (_value: string, _two: number) => {},
                    errorMessage: `["function (_value, _two)"]`,
                },
                {
                    description: 'function with rest params',
                    parameter: (_value: string, _two: number, ..._params: any[]) => {},
                    errorMessage: `["function (_value, _two)"]`,
                },
                {
                    description: 'function with optional params',
                    parameter: (_value: string, _two: number, _three?: number) => {},
                    errorMessage: `["function (_value, _two, _three)"]`,
                },
                {
                    description: 'object with nested arrays and objects',
                    parameter: { items: [{ func: (_one: string) => false }] },
                    errorMessage: `[{"items":[{"func":"function (_one)"}]}]`,
                },
            ];

            tests.forEach((test) => {
                it(`should correctly display ${test.description}`, () => {
                    mock.functionWithParamsAndReturn(test.parameter);

                    const expectedError = `Expected "functionWithParamsAndReturn" to be called 1 times with params [<customParameterMatchFunction>] but it was called 0 times with matching parameters and 1 times in total.\n[\n${test.errorMessage}\n]`;

                    verifyFailure(
                        mocked.withFunction('functionWithParamsAndReturn').withParameters(() => false),
                        matchers.wasCalledOnce(),
                        expectedError,
                    );
                });
            });
        });
    });
});

class SampleMockedClass {
    public static propertyOne = '';
    public static propertyTwo = 2;

    public static doStuff() {}
    public static doStuffWithParams(_paramOne: string, _paramTwo: number, _paramThree?: boolean) {}

    public propertyOne = 'mocked';
    public propertyTwo = 123;
    public propertyThree = true;

    constructor(_paramsOne: {}, _paramTwo: Date) {}

    public functionWithNoParamsAndNoReturn(): void {}

    public functionWithNoParamsAndReturnType(): string {
        return 'sampleReturnString';
    }

    public functionWithParamsAndNoReturn(_paramOne: string, _paramTwo: number, _paramThree?: boolean) {}

    public functionWithParamsAndReturn(paramOne: string, paramTwo?: number, paramThree?: boolean): string {
        return `sampleReturn_${paramOne}_${paramTwo}_${paramThree}`;
    }

    public functionWithComplexParam(
        _param: { one: string; two: number; three?: Date },
        _two?: string,
        _three?: number,
    ): void {}

    public functionWithCallback(_callback: () => boolean): void {}
}
