export type OperatorFunction<T, C extends ConstructorFunction<T>> = (value: IMocked<T, C>) => IMocked<T, C>;

export type MatchFunction<T> = (passedValue: T) => boolean;

// tslint:disable-next-line:ban-types
export type FunctionsOnly<T> = Pick<T, { [K in keyof T]: Required<T>[K] extends Function ? K : never }[keyof T]>;

/**
 * Allows custom logic to verify that a function parameter has the expected value.
 */
export interface IParameterMatcher<T = any> {
    /**
     * function that takes the actual parameter value and returns true if it was the expected value
     */
    readonly isExpectedValue: MatchFunction<T>;
    /**
     * A string representation of the expected value to be used in failure messages
     */
    readonly expectedDisplayValue: string;
    /**
     * Used to format a value into a string to display value of actual parameters passed in failure messages
     */
    readonly parameterToString?: (value: T) => string;
}

export type ParameterMatcher<T> = IParameterMatcher<T> | MatchFunction<T> | T;

type FunctionOrConstructor = (new (...params: any[]) => any) | ((...params: any[]) => any);

export type FunctionParameterMatchers<T extends any[]> = {
    [P in keyof T]: T[P] extends FunctionOrConstructor ? IParameterMatcher<T[P]> : ParameterMatcher<T[P]>;
};

export type FunctionCallLookup = { [key: string]: any[][] };

export type FunctionParams<T> = T extends (...args: infer P) => any ? P : never;

export type ConstructorFunction<T> = new (...args: any[]) => T;

export type StaticFunctionTypes = 'staticFunction' | 'staticGetter' | 'staticSetter';
export type InstanceFunctionTypes = 'function' | 'getter' | 'setter';
export type SetterTypes = 'staticSetter' | 'setter';

export type FunctionType = StaticFunctionTypes | InstanceFunctionTypes;

export interface IFunctionWithParametersVerification<
    P extends Array<any>,
    T,
    C extends new (...args: any[]) => T = never
> extends IFunctionVerification<T, C> {
    /**
     * Checks the parameters in a non-strict equality way.
     * defaults to the toEqual() matcher
     * Equivalent to expected == actual
     *
     * Expected parameter values can be passed that uses the default matcher (toEqual)
     * Other matchers, a comparison function or a custom IParameterMatcher can also be passed
     *
     * If your function accepts functions as parameters an IParameterMatcher must be used
     *
     * Note: if a matcher function ((value: T) => true) no information will be provided about what
     * value the parameter was expected to be in a test failure message.
     * To provide this expected value string implement IParameterMatcher instead
     *
     * @param args list of parameters to compare against
     */
    withParameters(...args: FunctionParameterMatchers<P>): IStrictFunctionVerification<T, C>;
    /**
     * Checks the parameters in a strict euqlity way.
     * defaults to the toBe() matcher
     * Equivalent to expected == actual
     *
     * Expected parameter values can be passed that uses the default matcher (toBe)
     * Other matchers, a comparison function or a custom IParameterMatcher can also be passed
     *
     * If your function accepts functions as parameters an IParameterMatcher must be used
     *
     * Note: if a matcher function ((value: T) => true) no information will be provided about what
     * value the parameter was expected to be in a test failure message.
     * To provide this expected value string implement IParameterMatcher instead
     *
     * @param args list of parameters to compare against
     */
    withParametersEqualTo(...args: FunctionParameterMatchers<P>): IStrictFunctionVerification<T, C>;
}

export interface IStrictFunctionVerification<T, C extends new (...args: any[]) => T = never>
    extends IFunctionVerification<T, C> {
    /**
     * verify that the function has been called ONLY with the specified parameters and never without
     */
    strict(): IFunctionVerification<T, C>;
}

export interface IFunctionVerification<T, C extends new (...args: any[]) => T = never> {
    getMock(): IMocked<T, C>;
    wasCalledOnce(): void;
    /**
     * Verifies that the function was called a given number of times.
     * If times is not specified it is verified that the function was called at least once.
     *
     * @param times optional number of times the function is expected to have been called
     */
    wasCalled(times?: number): void;
    wasNotCalled(): void;
}

export interface IMocked<T, C extends new (...args: any[]) => T = never> {
    /**
     * The mocked object. This should be passed to your SUT.
     */
    mock: T;
    /**
     * The mocked constructor (if statics have been mocked).
     * This can be used to return the mocked instance with new myMock.constructor() and for accessing statics.
     */
    mockConstructor: C;

    functionCallLookup: FunctionCallLookup;
    setterCallLookup: FunctionCallLookup;
    getterCallLookup: FunctionCallLookup;

    staticFunctionCallLookup: FunctionCallLookup;
    staticSetterCallLookup: FunctionCallLookup;
    staticGetterCallLookup: FunctionCallLookup;

    /**
     * Used to setup the mock with multiple operators.
     *
     * Mock.create<IMyService>().setup(
     *     setupFunction("functionName"),
     *     setupFunction("otherFunction"),
     *     setupProperty("propertyName"),
     * );
     *
     * @param operators
     */
    setup(...operators: OperatorFunction<T, C>[]): IMocked<T, C>;

    /**
     * Sets up a single function and returns a function verifier to verify calls made and parameters passed.
     *
     * @param functionName
     * @param mockFunction
     */
    setupFunction<K extends keyof FunctionsOnly<T>>(
        functionName: K,
        mockFunction?: T[K],
    ): IFunctionWithParametersVerification<FunctionParams<T[K]>, T, C>;
    /**
     * Sets up a single property and returns a function verifier to verify value get or set operations.
     *
     * @param propertyname
     * @param value
     */
    setupProperty<K extends keyof T>(propertyname: K, value?: T[K]): IFunctionVerification<T, C>;
    /**
     * Defines a single property and allows getters and setters to be defined.
     * Returns a function verifier to verify get and set operations
     *
     * @param propertyname
     * @param getter
     * @param setter
     */
    defineProperty<K extends keyof T>(
        propertyname: K,
        getter?: () => T[K],
        setter?: (value: T[K]) => void,
    ): IFunctionVerification<T, C>;

    /**
     * Sets up a single static function and returns a function verifier to verify calls made and parameters passed.
     *
     * @param functionName
     * @param mockFunction
     */
    setupStaticFunction<K extends keyof FunctionsOnly<C>>(
        functionName: K,
        mockFunction?: C[K],
    ): IFunctionWithParametersVerification<FunctionParams<C[K]>, T, C>;
    /**
     * Sets up a single static property and returns a function verifier to verify value get or set operations.
     *
     * @param propertyname
     * @param value
     */
    setupStaticProperty<K extends keyof C>(propertyname: K, value?: C[K]): IFunctionVerification<T, C>;
    /**
     * Defines a single static property and allows getters and setters to be defined.
     * Returns a function verifier to verify get and set operations
     *
     * @param propertyname
     * @param getter
     * @param setter
     */
    defineStaticProperty<K extends keyof C>(
        propertyname: K,
        getter?: () => C[K],
        setter?: (value: C[K]) => void,
    ): IFunctionVerification<T, C>;

    /**
     * Verifies calls to a previously setup function.
     * myMock.withFunction("functionName").wasNotCalled():
     * myMock.withFunction("functionName").wasCalledOnce():
     * myMock.withFunction("functionName").withParameters("one", 2).wasCalledOnce():
     *
     * @param functionName
     */
    withFunction<K extends keyof FunctionsOnly<T>>(
        functionName: K,
    ): IFunctionWithParametersVerification<FunctionParams<T[K]>, T, C>;
    /**
     * Verifies calls to a previously setup getter.
     * myMock.withGetter("propertyName").wasNotCalled():
     * myMock.withGetter("propertyName").wasCalledOnce():
     *
     * @param functionName
     */
    withGetter<K extends keyof T>(propertyname: K): IFunctionVerification<T, C>;
    /**
     * Verifies calls to a previously setup setter.
     * myMock.withSetter("propertyName").wasNotCalled():
     * myMock.withSetter("propertyName").wasCalledOnce():
     * myMock.withSetter("propertyName").withParameters("one").wasCalledOnce():
     *
     * @param functionName
     */
    withSetter<K extends keyof T>(propertyname: K): IFunctionWithParametersVerification<[T[K]], T, C>;

    /**
     * Verifies calls to a previously setup static function.
     * myMock.withStaticFunction("functionName").wasNotCalled():
     * myMock.withStaticFunction("functionName").wasCalledOnce():
     * myMock.withStaticFunction("functionName").withParameters("one", 2).wasCalledOnce():
     *
     * @param functionName
     */
    withStaticFunction<K extends keyof FunctionsOnly<C>>(
        functionName: K,
    ): IFunctionWithParametersVerification<FunctionParams<C[K]>, T, C>;
    /**
     * Verifies calls to a previously setup static getter.
     * myMock.withStaticGetter("functionName").wasNotCalled():
     * myMock.withStaticGetter("functionName").wasCalledOnce():
     *
     * @param functionName
     */
    withStaticGetter<K extends keyof C>(propertyname: K): IFunctionVerification<T, C>;
    /**
     * Verifies calls to a previously setup static setter.
     * myMock.withStaticSetter("functionName").wasNotCalled():
     * myMock.withStaticSetter("functionName").wasCalledOnce():
     * myMock.withStaticSetter("functionName").withParameters("one").wasCalledOnce():
     *
     * @param functionName
     */
    withStaticSetter<K extends keyof C>(propertyname: K): IFunctionWithParametersVerification<[C[K]], T, C>;
}
