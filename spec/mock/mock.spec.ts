import { any, hasValue, IParameterMatcher, toBe, toBeDefined, toEqual } from '../../main';
import { Mock } from '../../main';
import { IMocked } from '../../main';
import { defineProperty, setupFunction, setupProperty } from '../../main/mock/operators';

// tslint:disable:no-empty
describe('mock', () => {
    let mocked: IMocked<SampleMockedClass, typeof SampleMockedClass>;
    let mock: SampleMockedClass;

    // just a convenience to get a value and avoid compile / lint errors
    // tslint:disable-next-line:no-empty
    function get(_value: any) {}

    beforeEach(() => {
        mocked = Mock.create<SampleMockedClass>();
        mock = mocked.mock;
    });

    describe('setup', () => {
        it('withFunction will throw a meaningful error if we try to assert a function that is not setup', () => {
            expect(() => mocked.withFunction('functionWithNoParamsAndNoReturn').wasNotCalled()).toThrowError(
                `Function "functionWithNoParamsAndNoReturn" has not been setup. Please setup using Mock.setupFunction() before verifying calls.`,
            );
        });

        it('withGetter will throw a meaningful error if we try to assert a getter that is not setup', () => {
            expect(() => mocked.withGetter('propertyOne').wasNotCalled()).toThrowError(
                `Property "propertyOne" has not been setup. Please setup using Mock.setupProperty() before verifying calls.`,
            );
        });

        it('withSetter will throw a meaningful error if we try to assert a setter that is not setup', () => {
            expect(() => mocked.withSetter('propertyTwo').wasNotCalled()).toThrowError(
                `Property "propertyTwo" has not been setup. Please setup using Mock.setupProperty() before verifying calls.`,
            );
        });
    });

    describe('withFunction', () => {
        it('called directly on mock instance', () => {
            mocked.setup(setupFunction('functionWithNoParamsAndNoReturn'));

            mock.functionWithNoParamsAndNoReturn();

            mocked.withFunction('functionWithNoParamsAndNoReturn').wasCalled();
        });

        it('called on checker returned from setup function', () => {
            const verifier = mocked.setupFunction('functionWithNoParamsAndNoReturn');

            mock.functionWithNoParamsAndNoReturn();

            verifier.wasCalled();
        });

        describe('assertion with no parameters', () => {
            beforeEach(() => {
                mocked.setup(setupFunction('functionWithNoParamsAndNoReturn'));
            });

            describe('wasCalled()', () => {
                it('should not throw an error when function has been called once', () => {
                    mock.functionWithNoParamsAndNoReturn();

                    mocked.withFunction('functionWithNoParamsAndNoReturn').wasCalled();
                });

                it('should not throw an error when function has been called multiple times', () => {
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();

                    mocked.withFunction('functionWithNoParamsAndNoReturn').wasCalled();
                });

                it('should throw an error when function has not been called', () => {
                    expect(() => mocked.withFunction('functionWithNoParamsAndNoReturn').wasCalled()).toThrowError(
                        `Expected "functionWithNoParamsAndNoReturn" to be called but it was not.`,
                    );
                });
            });

            describe('wasNotCalled()', () => {
                it('should throw an error when function has been called once', () => {
                    mock.functionWithNoParamsAndNoReturn();

                    expect(() => mocked.withFunction('functionWithNoParamsAndNoReturn').wasNotCalled()).toThrowError(
                        `Expected "functionWithNoParamsAndNoReturn" to be called 0 times but it was called 1 times with matching parameters and 1 times in total.`,
                    );
                });

                it('should throw an error when function has been called multiple times', () => {
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();

                    expect(() => mocked.withFunction('functionWithNoParamsAndNoReturn').wasNotCalled()).toThrowError(
                        `Expected "functionWithNoParamsAndNoReturn" to be called 0 times but it was called 3 times with matching parameters and 3 times in total.`,
                    );
                });

                it('should not throw an error when function has not been called', () => {
                    mocked.withFunction('functionWithNoParamsAndNoReturn').wasNotCalled();
                });
            });

            describe('wasCalled(0)', () => {
                it('should throw an error when function has been called once', () => {
                    mock.functionWithNoParamsAndNoReturn();

                    expect(() => mocked.withFunction('functionWithNoParamsAndNoReturn').wasCalled(0)).toThrowError(
                        `Expected "functionWithNoParamsAndNoReturn" to be called 0 times but it was called 1 times with matching parameters and 1 times in total.`,
                    );
                });

                it('should throw an error when function has been called multiple times', () => {
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();

                    expect(() => mocked.withFunction('functionWithNoParamsAndNoReturn').wasCalled(0)).toThrowError(
                        `Expected "functionWithNoParamsAndNoReturn" to be called 0 times but it was called 3 times with matching parameters and 3 times in total.`,
                    );
                });

                it('should not throw an error when function has not been called', () => {
                    mocked.withFunction('functionWithNoParamsAndNoReturn').wasCalled(0);
                });
            });

            describe('wasCalledOnce', () => {
                it('should not throw an error when function has been called once', () => {
                    mock.functionWithNoParamsAndNoReturn();

                    mocked.withFunction('functionWithNoParamsAndNoReturn').wasCalledOnce();
                });

                it('should throw an error when function has been called multiple times', () => {
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();

                    expect(() => mocked.withFunction('functionWithNoParamsAndNoReturn').wasCalledOnce()).toThrowError(
                        `Expected "functionWithNoParamsAndNoReturn" to be called 1 times but it was called 3 times with matching parameters and 3 times in total.`,
                    );
                });

                it('should throw an error when function has not been called', () => {
                    expect(() => mocked.withFunction('functionWithNoParamsAndNoReturn').wasCalledOnce()).toThrowError(
                        `Expected "functionWithNoParamsAndNoReturn" to be called 1 times but it was called 0 times with matching parameters and 0 times in total.`,
                    );
                });
            });

            describe('wasCalled(1)', () => {
                it('should not throw an error when function has been called once', () => {
                    mock.functionWithNoParamsAndNoReturn();

                    mocked.withFunction('functionWithNoParamsAndNoReturn').wasCalled(1);
                });

                it('should throw an error when function has been called multiple times', () => {
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();

                    expect(() => mocked.withFunction('functionWithNoParamsAndNoReturn').wasCalled(1)).toThrowError(
                        `Expected "functionWithNoParamsAndNoReturn" to be called 1 times but it was called 3 times with matching parameters and 3 times in total.`,
                    );
                });

                it('should throw an error when function has not been called', () => {
                    expect(() => mocked.withFunction('functionWithNoParamsAndNoReturn').wasCalled(1)).toThrowError(
                        `Expected "functionWithNoParamsAndNoReturn" to be called 1 times but it was called 0 times with matching parameters and 0 times in total.`,
                    );
                });
            });

            describe('wasCalled(2)', () => {
                it('should throw an error when function has been called once', () => {
                    mock.functionWithNoParamsAndNoReturn();

                    expect(() => mocked.withFunction('functionWithNoParamsAndNoReturn').wasCalled(2)).toThrowError(
                        `Expected "functionWithNoParamsAndNoReturn" to be called 2 times but it was called 1 times with matching parameters and 1 times in total.`,
                    );
                });

                it('should not throw an error when function has been called twice', () => {
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();

                    mocked.withFunction('functionWithNoParamsAndNoReturn').wasCalled(2);
                });

                it('should throw an error when function has been called multiple times', () => {
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();
                    mock.functionWithNoParamsAndNoReturn();

                    expect(() => mocked.withFunction('functionWithNoParamsAndNoReturn').wasCalled(2)).toThrowError(
                        `Expected "functionWithNoParamsAndNoReturn" to be called 2 times but it was called 3 times with matching parameters and 3 times in total.`,
                    );
                });

                it('should throw an error when function has not been called', () => {
                    expect(() => mocked.withFunction('functionWithNoParamsAndNoReturn').wasCalled(2)).toThrowError(
                        `Expected "functionWithNoParamsAndNoReturn" to be called 2 times but it was called 0 times with matching parameters and 0 times in total.`,
                    );
                });
            });
        });

        describe('assertion with parameters', () => {
            beforeEach(() => {
                mocked.setup(setupFunction('functionWithParamsAndReturn'));
            });

            describe('wasCalled()', () => {
                it('should not throw an error when function has been called once with matching params', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);

                    mocked
                        .withFunction('functionWithParamsAndReturn')
                        .withParameters('one', 123, true)
                        .wasCalled();
                });

                it(`should throw an error when function has been called once with "two" instaed of "one"`, () => {
                    mock.functionWithParamsAndReturn('two', 123, true);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .wasCalled(),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called with params ["one", 123, true] but it was not.`,
                    );
                });

                it(`should throw an error when function has been called once with "456" instaed of "123"`, () => {
                    mock.functionWithParamsAndReturn('one', 456, true);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .wasCalled(),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called with params ["one", 123, true] but it was not.`,
                    );
                });

                it(`should throw an error when function has been called once with "false" instaed of "true"`, () => {
                    mock.functionWithParamsAndReturn('one', 123, false);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .wasCalled(),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called with params ["one", 123, true] but it was not.`,
                    );
                });

                it('should throw an error when function has been called once with missing parameters', () => {
                    mock.functionWithParamsAndReturn('one');

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .wasCalled(),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called with params ["one", 123, true] but it was not.`,
                    );
                });

                it('should not throw an error when function has been called multiple times', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);

                    mocked
                        .withFunction('functionWithParamsAndReturn')
                        .withParameters('one', 123, true)
                        .wasCalled();
                });

                it('should throw an error when function has not been called', () => {
                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .wasCalled(),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called with params ["one", 123, true] but it was not.`,
                    );
                });
            });

            describe('wasNotCalled()', () => {
                it('should throw an error when function has been called once with matching parameters', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .wasNotCalled(),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called 0 times with params ["one", 123, true] but it was called 1 times with matching parameters and 1 times in total \n[\n["one",123,true]\n].`,
                    );
                });

                it('should not throw an error when function has been called once with different parameters', () => {
                    mock.functionWithParamsAndReturn('two', 123, true);

                    mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true);
                });

                it('should throw an error when function has been called multiple times with matching params', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .wasNotCalled(),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called 0 times with params ["one", 123, true] but it was called 3 times with matching parameters and 3 times in total \n[\n[\"one\",123,true]\n[\"one\",123,true]\n[\"one\",123,true]\n].`,
                    );
                });

                it('should not throw an error when function has not been called', () => {
                    mocked.withFunction('functionWithParamsAndReturn').withParameters('one', 123, true);
                });
            });

            describe('wasCalledOnce()', () => {
                it('should not throw an error when function has been called once with matching parameters', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);

                    mocked
                        .withFunction('functionWithParamsAndReturn')
                        .withParameters('one', 123, true)
                        .wasCalledOnce();
                });

                it('should not throw an error when function has been called once with matching parameters and many times with other params', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);

                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    mocked
                        .withFunction('functionWithParamsAndReturn')
                        .withParameters('one', 123, true)
                        .wasCalledOnce();
                });

                it('should throw an error when function has been called multiple times', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .wasCalledOnce(),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called 1 times with params ["one", 123, true] but it was called 3 times with matching parameters and 3 times in total \n[\n[\"one\",123,true]\n[\"one\",123,true]\n[\"one\",123,true]\n].`,
                    );
                });

                it('should throw an error when function has not been called with matching params but multiple times with other params', () => {
                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .wasCalledOnce(),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called 1 times with params ["one", 123, true] but it was called 0 times with matching parameters and 3 times in total \n[\n[\"two\",123,true]\n[\"one\",456,true]\n[\"one\",456,false]\n].`,
                    );
                });
            });

            describe('wasCalled(2)', () => {
                it('should throw an error when function has been called once with correct parameters', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);

                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .wasCalled(2),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called 2 times with params ["one", 123, true] but it was called 1 times with matching parameters and 4 times in total \n[\n[\"one\",123,true]\n[\"two\",123,true]\n[\"one\",456,true]\n[\"one\",456,false]\n].`,
                    );
                });

                it('should throw an error when function has been called twice with incorrect params', () => {
                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .wasCalled(2),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called 2 times with params ["one", 123, true] but it was called 0 times with matching parameters and 2 times in total \n[\n[\"two\",123,true]\n[\"one\",456,true]\n].`,
                    );
                });

                it('should not throw an error when function has been called twice with correct params and multiple times with different params', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);

                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    mocked
                        .withFunction('functionWithParamsAndReturn')
                        .withParameters('one', 123, true)
                        .wasCalled(2);
                });

                it('should throw an error when function has been called multiple times with matching params', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .wasCalled(2),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called 2 times with params ["one", 123, true] but it was called 3 times with matching parameters and 3 times in total \n[\n[\"one\",123,true]\n[\"one\",123,true]\n[\"one\",123,true]\n].`,
                    );
                });

                it('should throw an error when function has not been called with matching params but has been called with different params', () => {
                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .wasCalled(2),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called 2 times with params ["one", 123, true] but it was called 0 times with matching parameters and 3 times in total \n[\n[\"two\",123,true]\n[\"one\",456,true]\n[\"one\",456,false]\n].`,
                    );
                });
            });
        });

        describe('assertion with params and explicit', () => {
            beforeEach(() => {
                mocked.setup(setupFunction('functionWithParamsAndReturn'));
            });

            describe('wasNotCalled()', () => {
                it('should throw an error when function has been called once with matching parameters', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .strict()
                            .wasNotCalled(),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called 0 times with params ["one", 123, true] and 0 times with any other parameters but it was called 1 times with matching parameters and 1 times in total \n[\n["one",123,true]\n].`,
                    );
                });

                it('should throw an error when function has been called once with different parameters', () => {
                    mock.functionWithParamsAndReturn('two', 123, true);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .strict()
                            .wasNotCalled(),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called 0 times with params ["one", 123, true] and 0 times with any other parameters but it was called 0 times with matching parameters and 1 times in total \n[\n["two",123,true]\n].`,
                    );
                });

                it('should throw an error when function has been called multiple times with matching params', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .strict()
                            .wasNotCalled(),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called 0 times with params ["one", 123, true] and 0 times with any other parameters but it was called 3 times with matching parameters and 3 times in total \n[\n[\"one\",123,true]\n[\"one\",123,true]\n[\"one\",123,true]\n].`,
                    );
                });

                it('should not throw an error when function has not been called', () => {
                    mocked
                        .withFunction('functionWithParamsAndReturn')
                        .withParameters('one', 123, true)
                        .strict()
                        .wasNotCalled();
                });
            });

            describe('wasCalledOnce()', () => {
                it('should not throw an error when function has been called once with matching parameters', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);

                    mocked
                        .withFunction('functionWithParamsAndReturn')
                        .withParameters('one', 123, true)
                        .strict()
                        .wasCalledOnce();
                });

                it('should throw an error when function has been called once with matching parameters and many times with other params', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);

                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .strict()
                            .wasCalledOnce(),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called 1 times with params ["one", 123, true] and 0 times with any other parameters but it was called 1 times with matching parameters and 4 times in total \n[\n[\"one\",123,true]\n[\"two\",123,true]\n[\"one\",456,true]\n[\"one\",456,false]\n].`,
                    );
                });

                it('should throw an error when function has been called multiple times', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .strict()
                            .wasCalledOnce(),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called 1 times with params ["one", 123, true] and 0 times with any other parameters but it was called 3 times with matching parameters and 3 times in total \n[\n[\"one\",123,true]\n[\"one\",123,true]\n[\"one\",123,true]\n].`,
                    );
                });

                it('should throw an error when function has not been called with matching params but multiple times with other params', () => {
                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .strict()
                            .wasCalledOnce(),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called 1 times with params ["one", 123, true] and 0 times with any other parameters but it was called 0 times with matching parameters and 3 times in total \n[\n[\"two\",123,true]\n[\"one\",456,true]\n[\"one\",456,false]\n].`,
                    );
                });
            });

            describe('wasCalled(2)', () => {
                it('should throw an error when function has been called once with correct parameters', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);

                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .strict()
                            .wasCalled(2),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called 2 times with params ["one", 123, true] and 0 times with any other parameters but it was called 1 times with matching parameters and 4 times in total \n[\n[\"one\",123,true]\n[\"two\",123,true]\n[\"one\",456,true]\n[\"one\",456,false]\n].`,
                    );
                });

                it('should throw an error when function has been called twice with incorrect params', () => {
                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .strict()
                            .wasCalled(2),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called 2 times with params ["one", 123, true] and 0 times with any other parameters but it was called 0 times with matching parameters and 2 times in total \n[\n[\"two\",123,true]\n[\"one\",456,true]\n].`,
                    );
                });

                it('should throw an error when function has been called twice with correct params and multiple times with different params', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);

                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .strict()
                            .wasCalled(2),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called 2 times with params ["one", 123, true] and 0 times with any other parameters but it was called 2 times with matching parameters and 5 times in total \n[\n[\"one\",123,true]\n[\"one\",123,true]\n[\"two\",123,true]\n[\"one\",456,true]\n[\"one\",456,false]\n].`,
                    );
                });

                it('should throw an error when function has been called multiple times with matching params', () => {
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);
                    mock.functionWithParamsAndReturn('one', 123, true);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .strict()
                            .wasCalled(2),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called 2 times with params ["one", 123, true] and 0 times with any other parameters but it was called 3 times with matching parameters and 3 times in total \n[\n[\"one\",123,true]\n[\"one\",123,true]\n[\"one\",123,true]\n].`,
                    );
                });

                it('should throw an error when function has not been called with matching params but has been called with different params', () => {
                    mock.functionWithParamsAndReturn('two', 123, true);
                    mock.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .strict()
                            .wasCalled(2),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called 2 times with params ["one", 123, true] and 0 times with any other parameters but it was called 0 times with matching parameters and 3 times in total \n[\n[\"two\",123,true]\n[\"one\",456,true]\n[\"one\",456,false]\n].`,
                    );
                });

                it('should count function calls the same regardless of called via mock or constructor', () => {
                    const constructedInstace = new mocked.mockConstructor({}, new Date());

                    constructedInstace.functionWithParamsAndReturn('one', 123, true);

                    mock.functionWithParamsAndReturn('two', 123, true);
                    constructedInstace.functionWithParamsAndReturn('one', 456, true);
                    mock.functionWithParamsAndReturn('one', 456, false);

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters('one', 123, true)
                            .strict()
                            .wasCalled(2),
                    ).toThrowError(
                        `Expected "functionWithParamsAndReturn" to be called 2 times with params ["one", 123, true] and 0 times with any other parameters but it was called 1 times with matching parameters and 4 times in total \n[\n[\"one\",123,true]\n[\"two\",123,true]\n[\"one\",456,true]\n[\"one\",456,false]\n].`,
                    );
                });
            });
        });
    });

    describe('withGetter', () => {
        it('called directly on mock instance', () => {
            mocked.setup(setupProperty('propertyOne'));

            get(mock.propertyOne);

            mocked.withGetter('propertyOne').wasCalled();
        });

        it('called on checker returned from setup function', () => {
            const verifier = mocked.setupProperty('propertyOne');

            get(mock.propertyOne);

            verifier.wasCalled();
        });

        describe('call count assertion', () => {
            beforeEach(() => {
                mocked.setup(setupProperty('propertyOne'));
            });

            describe('wasCalled()', () => {
                it('should not throw an error when getter has been called once', () => {
                    get(mock.propertyOne);

                    mocked.withGetter('propertyOne').wasCalled();
                });

                it('should not throw an error when getter has been called multiple times', () => {
                    get(mock.propertyOne);
                    get(mock.propertyOne);
                    get(mock.propertyOne);

                    mocked.withGetter('propertyOne').wasCalled();
                });

                it('should throw an error when getter has not been called', () => {
                    expect(() => mocked.withGetter('propertyOne').wasCalled()).toThrowError(
                        `Expected property "propertyOne" getter to be called but it was not.`,
                    );
                });
            });

            describe('wasNotCalled()', () => {
                it('should throw an error when getter has been called once', () => {
                    get(mock.propertyOne);

                    expect(() => mocked.withGetter('propertyOne').wasNotCalled()).toThrowError(
                        `Expected property "propertyOne" getter to be called 0 times but it was called 1 times with matching parameters and 1 times in total.`,
                    );
                });

                it('should throw an error when getter has been called multiple times', () => {
                    get(mock.propertyOne);
                    get(mock.propertyOne);
                    get(mock.propertyOne);

                    expect(() => mocked.withGetter('propertyOne').wasNotCalled()).toThrowError(
                        `Expected property "propertyOne" getter to be called 0 times but it was called 3 times with matching parameters and 3 times in total.`,
                    );
                });

                it('should not throw an error when getter has not been called', () => {
                    mocked.withGetter('propertyOne').wasNotCalled();
                });
            });

            describe('wasCalled(0)', () => {
                it('should throw an error when getter has been called once', () => {
                    get(mock.propertyOne);

                    expect(() => mocked.withGetter('propertyOne').wasCalled(0)).toThrowError(
                        `Expected property "propertyOne" getter to be called 0 times but it was called 1 times with matching parameters and 1 times in total.`,
                    );
                });

                it('should throw an error when getter has been called multiple times', () => {
                    get(mock.propertyOne);
                    get(mock.propertyOne);
                    get(mock.propertyOne);

                    expect(() => mocked.withGetter('propertyOne').wasCalled(0)).toThrowError(
                        `Expected property "propertyOne" getter to be called 0 times but it was called 3 times with matching parameters and 3 times in total.`,
                    );
                });

                it('should not throw an error when getter has not been called', () => {
                    mocked.withGetter('propertyOne').wasCalled(0);
                });
            });

            describe('wasCalledOnce', () => {
                it('should not throw an error when getter has been called once', () => {
                    get(mock.propertyOne);

                    mocked.withGetter('propertyOne').wasCalledOnce();
                });

                it('should throw an error when getter has been called multiple times', () => {
                    get(mock.propertyOne);
                    get(mock.propertyOne);
                    get(mock.propertyOne);

                    expect(() => mocked.withGetter('propertyOne').wasCalledOnce()).toThrowError(
                        `Expected property "propertyOne" getter to be called 1 times but it was called 3 times with matching parameters and 3 times in total.`,
                    );
                });

                it('should throw an error when getter has not been called', () => {
                    expect(() => mocked.withGetter('propertyOne').wasCalledOnce()).toThrowError(
                        `Expected property "propertyOne" getter to be called 1 times but it was called 0 times with matching parameters and 0 times in total.`,
                    );
                });
            });

            describe('wasCalled(1)', () => {
                it('should not throw an error when getter has been called once', () => {
                    get(mock.propertyOne);

                    mocked.withGetter('propertyOne').wasCalled(1);
                });

                it('should throw an error when getter has been called multiple times', () => {
                    get(mock.propertyOne);
                    get(mock.propertyOne);
                    get(mock.propertyOne);

                    expect(() => mocked.withGetter('propertyOne').wasCalled(1)).toThrowError(
                        `Expected property "propertyOne" getter to be called 1 times but it was called 3 times with matching parameters and 3 times in total.`,
                    );
                });

                it('should throw an error when getter has not been called', () => {
                    expect(() => mocked.withGetter('propertyOne').wasCalled(1)).toThrowError(
                        `Expected property "propertyOne" getter to be called 1 times but it was called 0 times with matching parameters and 0 times in total.`,
                    );
                });
            });

            describe('wasCalled(2)', () => {
                it('should throw an error when getter has been called once', () => {
                    get(mock.propertyOne);

                    expect(() => mocked.withGetter('propertyOne').wasCalled(2)).toThrowError(
                        `Expected property "propertyOne" getter to be called 2 times but it was called 1 times with matching parameters and 1 times in total.`,
                    );
                });

                it('should not throw an error when getter has been called twice', () => {
                    get(mock.propertyOne);
                    get(mock.propertyOne);

                    mocked.withGetter('propertyOne').wasCalled(2);
                });

                it('should throw an error when getter has been called multiple times', () => {
                    get(mock.propertyOne);
                    get(mock.propertyOne);
                    get(mock.propertyOne);

                    expect(() => mocked.withGetter('propertyOne').wasCalled(2)).toThrowError(
                        `Expected property "propertyOne" getter to be called 2 times but it was called 3 times with matching parameters and 3 times in total.`,
                    );
                });

                it('should count function calls the same regardless of called via mock or constructor', () => {
                    const constructedInstance = new mocked.mockConstructor({}, new Date());

                    get(mock.propertyOne);
                    get(constructedInstance.propertyOne);
                    get(mock.propertyOne);

                    expect(() => mocked.withGetter('propertyOne').wasCalled(2)).toThrowError(
                        `Expected property "propertyOne" getter to be called 2 times but it was called 3 times with matching parameters and 3 times in total.`,
                    );
                });

                it('should throw an error when getter has not been called', () => {
                    expect(() => mocked.withGetter('propertyOne').wasCalled(2)).toThrowError(
                        `Expected property "propertyOne" getter to be called 2 times but it was called 0 times with matching parameters and 0 times in total.`,
                    );
                });
            });
        });
    });

    describe('defineProperty', () => {
        it('called directly on mock instance', () => {
            mocked.setup(defineProperty('propertyOne'));

            get(mock.propertyOne);

            mocked.withGetter('propertyOne').wasCalled();
        });

        it('called on checker returned from setup function', () => {
            const verifier = mocked.defineProperty('propertyOne');

            get(mock.propertyOne);

            verifier.wasCalled();
        });
    });

    describe('withSetter', () => {
        describe('assertion with parameters', () => {
            beforeEach(() => {
                mocked.setup(defineProperty('propertyOne'));
            });

            describe('wasCalled()', () => {
                it('should not throw an error when function has been called once with matching params', () => {
                    mock.propertyOne = 'one';

                    mocked
                        .withSetter('propertyOne')
                        .withParameters('one')
                        .wasCalled();
                });

                it(`should throw an error when function has been called once with "two" instead of "one"`, () => {
                    mock.propertyOne = 'two';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .wasCalled(),
                    ).toThrowError(`Expected property "propertyOne" to be set with params ["one"] but it was not.`);
                });

                it('should not throw an error when function has been called multiple times', () => {
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';

                    mocked
                        .withSetter('propertyOne')
                        .withParameters('one')
                        .wasCalled();
                });

                it('should throw an error when function has not been called', () => {
                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .wasCalled(),
                    ).toThrowError(`Expected property "propertyOne" to be set with params ["one"] but it was not.`);
                });
            });

            describe('wasNotCalled()', () => {
                it('should throw an error when function has been called once with matching parameters', () => {
                    mock.propertyOne = 'one';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .wasNotCalled(),
                    ).toThrowError(
                        `Expected property "propertyOne" to be set 0 times with params ["one"] but it was called 1 times with matching parameters and 1 times in total \n[\n["one"]\n].`,
                    );
                });

                it('should not throw an error when function has been called once with different parameters', () => {
                    mock.propertyOne = 'one';

                    mocked.withSetter('propertyOne').withParameters('one');
                });

                it('should throw an error when function has been called multiple times with matching params', () => {
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .wasNotCalled(),
                    ).toThrowError(
                        `Expected property "propertyOne" to be set 0 times with params ["one"] but it was called 3 times with matching parameters and 3 times in total \n[\n[\"one\"]\n[\"one\"]\n[\"one\"]\n].`,
                    );
                });

                it('should not throw an error when function has not been called', () => {
                    mocked.withSetter('propertyOne').withParameters('one');
                });
            });

            describe('wasCalledOnce()', () => {
                it('should not throw an error when function has been called once with matching parameters', () => {
                    mock.propertyOne = 'one';

                    mocked
                        .withSetter('propertyOne')
                        .withParameters('one')
                        .wasCalledOnce();
                });

                it('should not throw an error when function has been called once with matching parameters and many times with other params', () => {
                    mock.propertyOne = 'one';

                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';
                    mock.propertyOne = 'four';

                    mocked
                        .withSetter('propertyOne')
                        .withParameters('one')
                        .wasCalledOnce();
                });

                it('should throw an error when function has been called multiple times', () => {
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .wasCalledOnce(),
                    ).toThrowError(
                        `Expected property "propertyOne" to be set 1 times with params ["one"] but it was called 3 times with matching parameters and 3 times in total \n[\n[\"one\"]\n[\"one\"]\n[\"one\"]\n].`,
                    );
                });

                it('should throw an error when function has not been called with matching params but multiple times with other params', () => {
                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';
                    mock.propertyOne = 'four';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .wasCalledOnce(),
                    ).toThrowError(
                        `Expected property "propertyOne" to be set 1 times with params ["one"] but it was called 0 times with matching parameters and 3 times in total \n[\n[\"two\"]\n[\"three\"]\n[\"four\"]\n].`,
                    );
                });
            });

            describe('wasCalled(2)', () => {
                it('should throw an error when function has been called once with correct parameters', () => {
                    mock.propertyOne = 'one';

                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';
                    mock.propertyOne = 'four';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .wasCalled(2),
                    ).toThrowError(
                        `Expected property "propertyOne" to be set 2 times with params ["one"] but it was called 1 times with matching parameters and 4 times in total \n[\n[\"one\"]\n[\"two\"]\n[\"three\"]\n[\"four\"]\n].`,
                    );
                });

                it('should throw an error when function has been called twice with incorrect params', () => {
                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .wasCalled(2),
                    ).toThrowError(
                        `Expected property "propertyOne" to be set 2 times with params ["one"] but it was called 0 times with matching parameters and 2 times in total \n[\n[\"two\"]\n[\"three\"]\n].`,
                    );
                });

                it('should not throw an error when function has been called twice with correct params and multiple times with different params', () => {
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';

                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';
                    mock.propertyOne = 'four';

                    mocked
                        .withSetter('propertyOne')
                        .withParameters('one')
                        .wasCalled(2);
                });

                it('should throw an error when function has been called multiple times with matching params', () => {
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .wasCalled(2),
                    ).toThrowError(
                        `Expected property "propertyOne" to be set 2 times with params ["one"] but it was called 3 times with matching parameters and 3 times in total \n[\n[\"one\"]\n[\"one\"]\n[\"one\"]\n].`,
                    );
                });

                it('should throw an error when function has not been called with matching params but has been called with different params', () => {
                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';
                    mock.propertyOne = 'four';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .wasCalled(2),
                    ).toThrowError(
                        `Expected property "propertyOne" to be set 2 times with params ["one"] but it was called 0 times with matching parameters and 3 times in total \n[\n[\"two\"]\n[\"three\"]\n[\"four\"]\n].`,
                    );
                });
            });
        });

        describe('assertion with params and explicit', () => {
            beforeEach(() => {
                mocked.setup(setupProperty('propertyOne'));
            });

            describe('wasNotCalled()', () => {
                it('should throw an error when function has been called once with matching parameters', () => {
                    mock.propertyOne = 'one';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .strict()
                            .wasNotCalled(),
                    ).toThrowError(
                        `Expected property "propertyOne" to be set 0 times with params ["one"] and 0 times with any other parameters but it was called 1 times with matching parameters and 1 times in total \n[\n["one"]\n].`,
                    );
                });

                it('should throw an error when function has been called once with different parameters', () => {
                    mock.propertyOne = 'two';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .strict()
                            .wasNotCalled(),
                    ).toThrowError(
                        `Expected property "propertyOne" to be set 0 times with params ["one"] and 0 times with any other parameters but it was called 0 times with matching parameters and 1 times in total \n[\n["two"]\n].`,
                    );
                });

                it('should throw an error when function has been called multiple times with matching params', () => {
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .strict()
                            .wasNotCalled(),
                    ).toThrowError(
                        `Expected property "propertyOne" to be set 0 times with params ["one"] and 0 times with any other parameters but it was called 3 times with matching parameters and 3 times in total \n[\n[\"one\"]\n[\"one\"]\n[\"one\"]\n].`,
                    );
                });

                it('should count function calls the same regardless of called via mock or constructor', () => {
                    const constructedInstance = new mocked.mockConstructor({}, new Date());

                    mock.propertyOne = 'one';
                    constructedInstance.propertyOne = 'one';
                    mock.propertyOne = 'one';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .strict()
                            .wasNotCalled(),
                    ).toThrowError(
                        `Expected property "propertyOne" to be set 0 times with params ["one"] and 0 times with any other parameters but it was called 3 times with matching parameters and 3 times in total \n[\n[\"one\"]\n[\"one\"]\n[\"one\"]\n].`,
                    );
                });

                it('should not throw an error when function has not been called', () => {
                    mocked
                        .withSetter('propertyOne')
                        .withParameters('one')
                        .strict()
                        .wasNotCalled();
                });
            });

            describe('wasCalledOnce()', () => {
                it('should not throw an error when function has been called once with matching parameters', () => {
                    mock.propertyOne = 'one';

                    mocked
                        .withSetter('propertyOne')
                        .withParameters('one')
                        .strict()
                        .wasCalledOnce();
                });

                it('should throw an error when function has been called once with matching parameters and many times with other params', () => {
                    mock.propertyOne = 'one';

                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';
                    mock.propertyOne = 'four';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .strict()
                            .wasCalledOnce(),
                    ).toThrowError(
                        `Expected property "propertyOne" to be set 1 times with params ["one"] and 0 times with any other parameters but it was called 1 times with matching parameters and 4 times in total \n[\n[\"one\"]\n[\"two\"]\n[\"three\"]\n[\"four\"]\n].`,
                    );
                });

                it('should throw an error when function has been called multiple times', () => {
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .strict()
                            .wasCalledOnce(),
                    ).toThrowError(
                        `Expected property "propertyOne" to be set 1 times with params ["one"] and 0 times with any other parameters but it was called 3 times with matching parameters and 3 times in total \n[\n[\"one\"]\n[\"one\"]\n[\"one\"]\n].`,
                    );
                });

                it('should throw an error when function has not been called with matching params but multiple times with other params', () => {
                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';
                    mock.propertyOne = 'four';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .strict()
                            .wasCalledOnce(),
                    ).toThrowError(
                        `Expected property "propertyOne" to be set 1 times with params ["one"] and 0 times with any other parameters but it was called 0 times with matching parameters and 3 times in total \n[\n[\"two\"]\n[\"three\"]\n[\"four\"]\n].`,
                    );
                });
            });

            describe('wasCalled(2)', () => {
                it('should throw an error when function has been called once with correct parameters', () => {
                    mock.propertyOne = 'one';

                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';
                    mock.propertyOne = 'four';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .strict()
                            .wasCalled(2),
                    ).toThrowError(
                        `Expected property "propertyOne" to be set 2 times with params ["one"] and 0 times with any other parameters but it was called 1 times with matching parameters and 4 times in total \n[\n[\"one\"]\n[\"two\"]\n[\"three\"]\n[\"four\"]\n].`,
                    );
                });

                it('should throw an error when function has been called twice with incorrect params', () => {
                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .strict()
                            .wasCalled(2),
                    ).toThrowError(
                        `Expected property "propertyOne" to be set 2 times with params ["one"] and 0 times with any other parameters but it was called 0 times with matching parameters and 2 times in total \n[\n[\"two\"]\n[\"three\"]\n].`,
                    );
                });

                it('should throw an error when function has been called twice with correct params and multiple times with different params', () => {
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';

                    mock.propertyOne = 'three';
                    mock.propertyOne = 'four';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .strict()
                            .wasCalled(2),
                    ).toThrowError(
                        `Expected property "propertyOne" to be set 2 times with params ["one"] and 0 times with any other parameters but it was called 2 times with matching parameters and 4 times in total \n[\n[\"one\"]\n[\"one\"]\n[\"three\"]\n[\"four\"]\n].`,
                    );
                });

                it('should throw an error when function has been called multiple times with matching params', () => {
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';
                    mock.propertyOne = 'one';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .strict()
                            .wasCalled(2),
                    ).toThrowError(
                        `Expected property "propertyOne" to be set 2 times with params ["one"] and 0 times with any other parameters but it was called 3 times with matching parameters and 3 times in total \n[\n[\"one\"]\n[\"one\"]\n[\"one\"]\n].`,
                    );
                });

                it('should throw an error when function has not been called with matching params but has been called with different params', () => {
                    mock.propertyOne = 'two';
                    mock.propertyOne = 'three';
                    mock.propertyOne = 'four';

                    expect(() =>
                        mocked
                            .withSetter('propertyOne')
                            .withParameters('one')
                            .strict()
                            .wasCalled(2),
                    ).toThrowError(
                        `Expected property "propertyOne" to be set 2 times with params ["one"] and 0 times with any other parameters but it was called 0 times with matching parameters and 3 times in total \n[\n[\"two\"]\n[\"three\"]\n[\"four\"]\n].`,
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
                return `mockFunctionOne`;
            }

            function mockFunctionTwo() {
                return `mockFunctionTwo`;
            }

            mocked.setup(setupFunction('functionWithParamsAndReturn', mockFunctionOne));
            mocked.setup(setupFunction('functionWithParamsAndReturn', mockFunctionTwo));

            expect(mock.functionWithParamsAndReturn('one', 2, true)).toEqual('mockFunctionTwo');
        });

        it('chaining setup functions should be supported', () => {
            const newMock = Mock.create<SampleMockedClass>().setup(
                setupFunction('functionWithNoParamsAndNoReturn'),
                setupFunction('functionWithNoParamsAndReturnType'),
                setupFunction('functionWithParamsAndNoReturn'),
                setupFunction('functionWithParamsAndReturn'),
            ).mock;

            newMock.functionWithNoParamsAndNoReturn();
            newMock.functionWithNoParamsAndReturnType();
            newMock.functionWithParamsAndNoReturn('', 123, true);
            newMock.functionWithParamsAndReturn('');
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

                mocked
                    .withFunction('functionWithComplexParam')
                    .withParameters(objectOne, 'two', 3)
                    .wasCalledOnce();
            });

            it('should fail when matching but not strictly equal objects passed', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(() =>
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(objectTwo, 'two', 3)
                        .wasCalledOnce(),
                ).toThrowError(
                    'Expected "functionWithComplexParam" to be called 1 times with params [{"one":"one","two":2}, "two", 3] but it was called 0 times with matching parameters and 1 times in total \n[\n[{"one":"one","two":2},"two",3]\n].',
                );
            });

            it('should fail when non matching parameters passed', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(() =>
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(objectOne, 'three', 4)
                        .wasCalledOnce(),
                ).toThrowError(
                    'Expected "functionWithComplexParam" to be called 1 times with params [{"one":"one","two":2}, "three", 4] but it was called 0 times with matching parameters and 1 times in total \n[\n[{"one":"one","two":2},"two",3]\n].',
                );
            });

            it('should fail when fewer parameters passed', () => {
                mock.functionWithComplexParam(objectOne, 'two');

                expect(() =>
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(objectOne, 'two', 3)
                        .wasCalledOnce(),
                ).toThrowError(
                    'Expected "functionWithComplexParam" to be called 1 times with params [{"one":"one","two":2}, "two", 3] but it was called 0 times with matching parameters and 1 times in total \n[\n[{"one":"one","two":2},"two"]\n].',
                );
            });

            it('should fail when extra parameters passed', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(() =>
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(objectOne, 'two')
                        .wasCalledOnce(),
                ).toThrowError(
                    'Expected "functionWithComplexParam" to be called 1 times with params [{"one":"one","two":2}, "two"] but it was called 0 times with matching parameters and 1 times in total \n[\n[{"one":"one","two":2},"two",3]\n].',
                );
            });

            it('should fail when custom matchers used', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(() =>
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(any(), () => false, {
                            isExpectedValue: () => false,
                            expectedDisplayValue: 'customMatcher',
                            parameterToString: (value: any) => `customMatcher_${value}`,
                        })
                        .wasCalledOnce(),
                ).toThrowError(
                    'Expected "functionWithComplexParam" to be called 1 times with params [<matchAny>, <customParameterMatchFunction>, customMatcher] but it was called 0 times with matching parameters and 1 times in total \n[\n[{"one":"one","two":2},"two",<customMatcher_3>]\n].',
                );
            });
        });

        describe('withParametersEqualTo', () => {
            it('should pass when same object is passed (strictly equal)', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                mocked
                    .withFunction('functionWithComplexParam')
                    .withParametersEqualTo(objectOne, 'two', 3)
                    .wasCalledOnce();
            });

            it('should pass when matching but not strictly equal objects passed', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                mocked
                    .withFunction('functionWithComplexParam')
                    .withParametersEqualTo(objectTwo, 'two', 3)
                    .wasCalledOnce();
            });

            it('should fail when non matching parameters passed', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(() =>
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParametersEqualTo(objectOne, 'three', 4)
                        .wasCalledOnce(),
                ).toThrowError(
                    'Expected "functionWithComplexParam" to be called 1 times with params [{"one":"one","two":2}, "three", 4] but it was called 0 times with matching parameters and 1 times in total \n[\n[{"one":"one","two":2},"two",3]\n].',
                );
            });

            it('should fail when fewer parameters passed', () => {
                mock.functionWithComplexParam(objectOne, 'two');

                expect(() =>
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParametersEqualTo(objectOne, 'two', 3)
                        .wasCalledOnce(),
                ).toThrowError(
                    'Expected "functionWithComplexParam" to be called 1 times with params [{"one":"one","two":2}, "two", 3] but it was called 0 times with matching parameters and 1 times in total \n[\n[{"one":"one","two":2},"two"]\n].',
                );
            });

            it('should fail when extra parameters passed', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(() =>
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParametersEqualTo(objectOne, 'two')
                        .wasCalledOnce(),
                ).toThrowError(
                    'Expected "functionWithComplexParam" to be called 1 times with params [{"one":"one","two":2}, "two"] but it was called 0 times with matching parameters and 1 times in total \n[\n[{"one":"one","two":2},"two",3]\n].',
                );
            });
        });

        describe('customMatchers', () => {
            it('should pass when toBeDefined matcher used', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                mocked
                    .withFunction('functionWithComplexParam')
                    .withParameters(toBeDefined(), toBeDefined(), toBeDefined())
                    .wasCalledOnce();
            });

            it('should pass when toBeDefined matcher used with null', () => {
                mock.functionWithComplexParam(null!, null!, null!);

                mocked
                    .withFunction('functionWithComplexParam')
                    .withParameters(toBeDefined(), toBeDefined(), toBeDefined())
                    .wasCalledOnce();
            });

            it('should fail when toBeDefined matcher used with undefined', () => {
                mock.functionWithComplexParam(undefined!, undefined!, undefined!);

                expect(() =>
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(toBeDefined(), toBeDefined(), toBeDefined())
                        .wasCalledOnce(),
                ).toThrowError(
                    'Expected "functionWithComplexParam" to be called 1 times with params [<mustBeDefined>, <mustBeDefined>, <mustBeDefined>] but it was called 0 times with matching parameters and 1 times in total \n[\n[undefined,undefined,undefined]\n].',
                );
            });

            it('should fail when hasValue matcher used with null', () => {
                mock.functionWithComplexParam(null!, null!, null!);

                expect(() =>
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(hasValue(), hasValue(), hasValue())
                        .wasCalledOnce(),
                ).toThrowError(
                    'Expected "functionWithComplexParam" to be called 1 times with params [<hasValue>, <hasValue>, <hasValue>] but it was called 0 times with matching parameters and 1 times in total \n[\n[null,null,null]\n].',
                );
            });

            it('should fail when hasValue matcher used with undefined', () => {
                mock.functionWithComplexParam(undefined!, undefined!, undefined!);

                expect(() =>
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(hasValue(), hasValue(), hasValue())
                        .wasCalledOnce(),
                ).toThrowError(
                    'Expected "functionWithComplexParam" to be called 1 times with params [<hasValue>, <hasValue>, <hasValue>] but it was called 0 times with matching parameters and 1 times in total \n[\n[undefined,undefined,undefined]\n].',
                );
            });

            it('should pass when toBe matcher used', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                mocked
                    .withFunction('functionWithComplexParam')
                    .withParameters(toBe(objectOne), toBe('two'), toBe(3))
                    .wasCalledOnce();
            });

            it('should fail when toBe matcher used', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(() =>
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(toBe(objectTwo), toBe('two'), toBe(3))
                        .wasCalledOnce(),
                ).toThrowError(
                    'Expected "functionWithComplexParam" to be called 1 times with params [{"one":"one","two":2}, "two", 3] but it was called 0 times with matching parameters and 1 times in total \n[\n[{"one":"one","two":2},"two",3]\n].',
                );
            });

            it('should pass when toEqual matcher used', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                mocked
                    .withFunction('functionWithComplexParam')
                    .withParameters(toEqual(objectTwo), toEqual('two'), toEqual(3))
                    .wasCalledOnce();
            });

            it('should fail when toEqual matcher used', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(() =>
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(toEqual(objectTwo), toEqual('two'), toEqual(4))
                        .wasCalledOnce(),
                ).toThrowError(
                    'Expected "functionWithComplexParam" to be called 1 times with params [{"one":"one","two":2}, "two", 4] but it was called 0 times with matching parameters and 1 times in total \n[\n[{"one":"one","two":2},"two",3]\n].',
                );
            });

            it('should pass when any matcher used', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                mocked
                    .withFunction('functionWithComplexParam')
                    .withParameters(any(), any(), any())
                    .wasCalledOnce();
            });

            it('should fail when any matcher used', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(() =>
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(any(), any(), toEqual(4))
                        .wasCalledOnce(),
                ).toThrowError(
                    'Expected "functionWithComplexParam" to be called 1 times with params [<matchAny>, <matchAny>, 4] but it was called 0 times with matching parameters and 1 times in total \n[\n[{"one":"one","two":2},"two",3]\n].',
                );
            });

            it('should pass when toBe used with function', () => {
                const callback = () => true;
                mock.functionWithCallback(callback);

                mocked
                    .withFunction('functionWithCallback')
                    .withParameters(toBe(callback))
                    .wasCalledOnce();
            });

            it('should fail when toBe used with function', () => {
                mock.functionWithCallback(() => true);

                expect(() =>
                    mocked
                        .withFunction('functionWithCallback')
                        .withParameters(toBe(() => true))
                        .wasCalledOnce(),
                ).toThrowError(
                    'Expected "functionWithCallback" to be called 1 times with params ["function ()"] but it was called 0 times with matching parameters and 1 times in total \n[\n["function ()"]\n].',
                );
            });

            it('should pass with custom match function', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                mocked
                    .withFunction('functionWithComplexParam')
                    .withParameters(
                        () => true,
                        () => true,
                        () => true,
                    )
                    .wasCalledOnce();
            });

            it('should fail with custom match function', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(() =>
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(
                            () => false,
                            () => false,
                            () => false,
                        )
                        .wasCalledOnce(),
                ).toThrowError(
                    'Expected "functionWithComplexParam" to be called 1 times with params [<customParameterMatchFunction>, <customParameterMatchFunction>, <customParameterMatchFunction>] but it was called 0 times with matching parameters and 1 times in total \n[\n[{"one":"one","two":2},"two",3]\n].',
                );
            });

            function createCustomMatcher<T>(expectedValue: T | undefined): IParameterMatcher<T | undefined> {
                return {
                    isExpectedValue: actualValue => actualValue === expectedValue,
                    expectedDisplayValue: `customMatcherExpectedValue: ${expectedValue}`,
                    parameterToString: value => `customMatcherActualValue: ${value}`,
                };
            }

            it('should pass with custom matchers', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                mocked
                    .withFunction('functionWithComplexParam')
                    .withParameters(createCustomMatcher(objectOne), createCustomMatcher('two'), createCustomMatcher(3))
                    .wasCalledOnce();
            });

            it('should fail with custom match function', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(() =>
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(
                            createCustomMatcher(objectTwo),
                            createCustomMatcher('two'),
                            createCustomMatcher(3),
                        )
                        .wasCalledOnce(),
                ).toThrowError(
                    'Expected "functionWithComplexParam" to be called 1 times with params [customMatcherExpectedValue: [object Object], customMatcherExpectedValue: two, customMatcherExpectedValue: 3] but it was called 0 times with matching parameters and 1 times in total \n[\n[<customMatcherActualValue: [object Object]>,<customMatcherActualValue: two>,<customMatcherActualValue: 3>]\n].',
                );
            });

            it('should throw a useful error if match function does not return a boolean', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(() =>
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(
                            value => `incorrect return value: ${value.one}` as any,
                            () => false,
                            () => false,
                        )
                        .wasCalledOnce(),
                ).toThrowError(
                    `Error: calling custom parameter match function returned "incorrect return value: one" rather than a boolean. You must use an existing IParameterMatcher (such as toBe(value)) or implement your own if you want to verify functions passed as mocked function arguments.`,
                );
            });

            it('should throw a useful error if match function throws an error', () => {
                mock.functionWithComplexParam(objectOne, 'two', 3);

                expect(() =>
                    mocked
                        .withFunction('functionWithComplexParam')
                        .withParameters(
                            () => {
                                throw new Error('Error thrown by function parameter matcher');
                            },
                            () => false,
                            () => false,
                        )
                        .wasCalledOnce(),
                ).toThrowError(
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

            tests.forEach(test => {
                it(`should correctly display ${test.description}`, () => {
                    mock.functionWithParamsAndReturn(test.parameter);

                    const expectedError = `Expected "functionWithParamsAndReturn" to be called 1 times with params [<customParameterMatchFunction>] but it was called 0 times with matching parameters and 1 times in total \n[\n${test.errorMessage}\n].`;

                    expect(() =>
                        mocked
                            .withFunction('functionWithParamsAndReturn')
                            .withParameters(() => false)
                            .wasCalledOnce(),
                    ).toThrowError(expectedError);
                });
            });
        });
    });
});

class SampleMockedClass {
    public static propertyOne = '';

    // tslint:disable-next-line:no-empty
    public static doStuff() {}

    public propertyOne: string = 'mocked';
    public propertyTwo: number = 123;
    public propertyThree: boolean = true;

    // tslint:disable-next-line:no-empty
    constructor(_paramsOne: {}, _paramTwo: Date) {}

    // tslint:disable-next-line:no-empty
    public functionWithNoParamsAndNoReturn(): void {}

    public functionWithNoParamsAndReturnType(): string {
        return 'sampleReturnString';
    }

    // tslint:disable-next-line:no-empty
    public functionWithParamsAndNoReturn(_paramOne: string, _paramTwo: number, _paramThree?: boolean) {}

    public functionWithParamsAndReturn(paramOne: string, paramTwo?: number, paramThree?: boolean): string {
        return `sampleReturn_${paramOne}_${paramTwo}_${paramThree}`;
    }

    // tslint:disable-next-line:no-empty
    public functionWithComplexParam(_param: { one: string; two: number }, _two?: string, _three?: number): void {}

    // tslint:disable-next-line:no-empty
    public functionWithCallback(_callback: () => boolean): void {}
}
