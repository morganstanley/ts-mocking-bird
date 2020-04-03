import {
    ConstructorFunction,
    FunctionParams,
    FunctionType,
    IFunctionVerification,
    IFunctionWithParametersVerification,
    IMocked,
    IParameterMatcher,
    IStrictFunctionVerification,
    MatchFunction,
    ParameterMatcher,
    SetterTypes,
    StaticFunctionTypes,
} from './contracts';
import { isParameterMatcher, mapItemToString, toBe, toEqual } from './matchers';

export type VerifierTarget<T, C extends ConstructorFunction<T>, U extends FunctionType> = U extends StaticFunctionTypes
    ? C
    : T;

export type FunctionName<T, C extends ConstructorFunction<T>, U extends FunctionType> = keyof VerifierTarget<T, C, U>;

export type VerifierParams<
    T,
    C extends ConstructorFunction<T>,
    U extends FunctionType,
    K extends FunctionName<T, C, U>
> = U extends SetterTypes ? [VerifierTarget<T, C, U>[K]] : FunctionParams<VerifierTarget<T, C, U>[K]>;

export function createFunctionParameterVerifier<
    T,
    C extends ConstructorFunction<T>,
    U extends FunctionType,
    K extends FunctionName<T, C, U>
>(
    mocked: IMocked<T, C>,
    type: U,
    functionName: K,
): IFunctionWithParametersVerification<VerifierParams<T, C, U, K>, T, C> {
    return {
        ...createFunctionVerifier(mocked, type, functionName),
        /**
         * withParameters and withParametersEqualTo should have signatures:
         *
         * withParameters: (...parameters: FunctionParameterMatchers<VerifierParams<T, C, U, K>>)
         * withParametersEqualTo: (...parameters: FunctionParameterMatchers<VerifierParams<T, C, U, K>>)
         *
         * but this gives the error: [ts] A rest parameter must be of an array type. [2370]
         * https://github.com/microsoft/TypeScript/issues/29919
         *
         * so we internally type the function as any. This does not affect the extrnal facing function type
         */
        withParameters: ((...parameters: ParameterMatcher<any>[]) =>
            verifyParameters(parameters, mocked, functionName, type, false)) as any,
        withParametersEqualTo: ((...parameters: ParameterMatcher<any>[]) =>
            verifyParameters(parameters, mocked, functionName, type, true)) as any,
    };
}

export function createFunctionVerifier<
    T,
    C extends ConstructorFunction<T>,
    U extends FunctionType,
    K extends FunctionName<T, C, U>
>(
    mocked: IMocked<T, C>,
    type: U,
    functionName: K,
    matchers?: ParameterMatcher<any>[],
    strict: boolean = false,
): IFunctionVerification<T, C> {
    return {
        getMock: () => mocked,
        wasCalled: (times?: number) => verifyFunctionCalled(times, functionName, mocked, type, matchers, strict),
        wasNotCalled: () => verifyFunctionCalled(0, functionName, mocked, type, matchers, strict),
        wasCalledOnce: () => verifyFunctionCalled(1, functionName, mocked, type, matchers, strict),
    };
}

export function createStrictFunctionVerifier<
    T,
    C extends ConstructorFunction<T>,
    U extends FunctionType,
    K extends FunctionName<T, C, U>
>(
    mocked: IMocked<T, C>,
    type: U,
    functionName: K,
    matchers?: ParameterMatcher<any>[],
): IStrictFunctionVerification<T, C> {
    return {
        ...createFunctionVerifier(mocked, type, functionName, matchers),
        strict: () => createFunctionVerifier(mocked, type, functionName, matchers, true),
    };
}

export function verifyParameters<
    T,
    C extends ConstructorFunction<T>,
    U extends FunctionType,
    K extends FunctionName<T, C, U>
>(
    parameters: ParameterMatcher<any>[],
    mocked: IMocked<T, C>,
    functionName: K,
    type: U,
    equals: boolean,
): IStrictFunctionVerification<T, C> {
    const parameterMatchers: (MatchFunction<any> | IParameterMatcher)[] | undefined =
        parameters.length > 0
            ? parameters.map((parameter: any) => mapParameterToMatcher(parameter, equals))
            : undefined;

    return createStrictFunctionVerifier(mocked, type, functionName, parameterMatchers);
}

function mapParameterToMatcher(
    param: ParameterMatcher<any>,
    equals: boolean,
): IParameterMatcher<any> | MatchFunction<any> {
    if (isParameterMatcher(param)) {
        return param;
    }

    if (typeof param === 'function') {
        return param;
    }

    return equals ? toEqual(param) : toBe(param);
}

function verifyFunctionCalled<
    T,
    C extends ConstructorFunction<T>,
    U extends FunctionType,
    K extends FunctionName<T, C, U>
>(
    times: number | undefined,
    functionName: K,
    mock: IMocked<T, C>,
    type: U,
    parameterMatchers?: (MatchFunction<any> | IParameterMatcher<any>)[],
    strict?: boolean,
) {
    let functionCalls: any[][];
    let expectationMessage: string;
    let errorMessageSetupFunction: string;
    let errorMessageDescription: string;

    switch (type) {
        case 'staticGetter':
            functionCalls = mock.staticGetterCallLookup[functionName as any];
            expectationMessage = `Expected static property "${functionName}" getter to be called`;
            errorMessageSetupFunction = `Mock.setupStaticProperty()`;
            errorMessageDescription = `Static property`;
            break;

        case 'staticSetter':
            functionCalls = mock.staticSetterCallLookup[functionName as any];
            expectationMessage = `Expected static property "${functionName}" to be set`;
            errorMessageSetupFunction = `Mock.setupStaticProperty()`;
            errorMessageDescription = `Static property`;
            break;

        case 'staticFunction':
            functionCalls = mock.staticFunctionCallLookup[functionName as any];
            expectationMessage = `Expected static function "${functionName}" to be called`;
            errorMessageSetupFunction = `Mock.setupStaticFunction()`;
            errorMessageDescription = `Static function`;
            break;

        case 'getter':
            functionCalls = mock.getterCallLookup[functionName as any];
            expectationMessage = `Expected property "${functionName}" getter to be called`;
            errorMessageSetupFunction = `Mock.setupProperty()`;
            errorMessageDescription = `Property`;
            break;

        case 'setter':
            functionCalls = mock.setterCallLookup[functionName as any];
            expectationMessage = `Expected property "${functionName}" to be set`;
            errorMessageSetupFunction = `Mock.setupProperty()`;
            errorMessageDescription = `Property`;
            break;

        default:
            functionCalls = mock.functionCallLookup[functionName as any];
            expectationMessage = `Expected "${functionName}" to be called`;
            errorMessageSetupFunction = `Mock.setupFunction()`;
            errorMessageDescription = `Function`;
    }

    let withParamsMessage: string;

    if (Array.isArray(parameterMatchers) && parameterMatchers.length > 0) {
        withParamsMessage = `with params [${expectedParametersToString(parameterMatchers)}] `;
        if (strict) {
            withParamsMessage = `${withParamsMessage}and 0 times with any other parameters `;
        }
    } else {
        withParamsMessage = '';
    }

    if (functionCalls === undefined) {
        throw new Error(
            `${errorMessageDescription} "${functionName}" has not been setup. Please setup using ${errorMessageSetupFunction} before verifying calls.`,
        );
    }

    const matchingCalls = functionCalls.filter(params => matchParameters(params, parameterMatchers));

    if (times !== undefined) {
        if (times !== matchingCalls.length || (strict && times !== functionCalls.length)) {
            let allCalls: string;
            if (functionCalls.some(call => call.length > 0)) {
                allCalls = ` \n[\n${functionCalls
                    .map(call => functionCallToString(call, parameterMatchers))
                    .join('\n')}\n]`;
            } else {
                allCalls = '';
            }

            throw Error(
                `${expectationMessage} ${times} times ${withParamsMessage}but it was called ${matchingCalls.length} times with matching parameters and ${functionCalls.length} times in total${allCalls}.`,
            );
        }

        if (strict) {
            expect(functionCalls.length).toEqual(times);
        } else {
            expect(matchingCalls.length).toEqual(times);
        }
    } else {
        if (matchingCalls.length === 0) {
            throw Error(`${expectationMessage} ${withParamsMessage}but it was not.`);
        }

        expect(matchingCalls.length).toBeGreaterThanOrEqual(0);
    }
}

function expectedParametersToString(parameterMatchers: ParameterMatcher<any>[]): string {
    return parameterMatchers
        .map(matcher => {
            return isParameterMatcher(matcher) ? matcher.expectedDisplayValue : '<customParameterMatchFunction>';
        })
        .join(', ');
}

function functionCallToString(call: any[], parameterMatchers?: ParameterMatcher<any>[]): string {
    const params = call
        .map((callParam, index) => {
            const matcher = parameterMatchers ? parameterMatchers[index] : undefined;

            if (isParameterMatcher(matcher) && matcher.parameterToString != null) {
                return `<${matcher.parameterToString(callParam)}>`;
            }

            return mapItemToString(callParam);
        })
        .join(',');
    return `[${params}]`;
}

function matchParameters(actualParameters: any[], parameterMatchers?: ParameterMatcher<any>[]): boolean {
    if (parameterMatchers == null) {
        return true;
    }

    if (actualParameters.length !== parameterMatchers.length) {
        return false;
    }

    return parameterMatchers.every((matcher, index) => {
        if (typeof matcher === 'function') {
            let matcherReturnValue: boolean;

            try {
                matcherReturnValue = matcher(actualParameters[index]);
            } catch (e) {
                throw new Error(
                    `Error: calling custom parameter match function threw an error (${e}) rather returning a boolean. You must use an existing IParameterMatcher (such as toBe(value)) or implement your own if you want to verify functions passed as mocked function arguments.`,
                );
            }

            if (typeof matcherReturnValue !== 'boolean') {
                throw new Error(
                    `Error: calling custom parameter match function returned "${matcherReturnValue}" rather than a boolean. You must use an existing IParameterMatcher (such as toBe(value)) or implement your own if you want to verify functions passed as mocked function arguments.`,
                );
            }

            return matcherReturnValue;
        } else {
            return matcher.isExpectedValue(actualParameters[index]);
        }
    });
}
