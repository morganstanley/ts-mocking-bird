import { IFunctionVerifier } from '../../main/index.js';
import { ICustomMatcher } from '../../main/mock/framework.contracts.js';

export function verifyFailure(
    verifier: IFunctionVerifier<any, any, any>,
    matcher: ICustomMatcher,
    message: string,
    ...params: any[]
) {
    const result = matcher.compare(verifier, ...params);

    expect(result.pass).toBeFalsy();
    expect(result.message).toEqual(message);
}

export function verifyJestFailure(
    verifier: IFunctionVerifier<any, any, any>,
    matcher: ICustomMatcher,
    message: string,
    ...params: any[]
) {
    const result = matcher.compare(verifier, ...params) as unknown as jest.CustomMatcherResult;

    expect(result.pass).toBeFalsy();
    expect(result.message()).toEqual(message);
}
