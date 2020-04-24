import { IFunctionVerifier } from './contracts';
import { verifyFunctionCalled } from './verifiers';

declare global {
    namespace jasmine {
        // tslint:disable-next-line: interface-name
        interface Matchers<T> {
            wasCalled: (times: number) => boolean;
            wasCalledOnce: () => boolean;
            wasNotCalled: () => boolean;
            wasCalledAtLeastOnce: () => boolean;
        }
    }
    namespace jest {
        // tslint:disable-next-line: interface-name
        interface Matchers<R, T> {
            wasCalled: (times: number) => boolean;
            wasCalledOnce: () => boolean;
            wasNotCalled: () => boolean;
            wasCalledAtLeastOnce: () => boolean;
        }
    }
}

export const matchers = {
    wasCalled,
    wasCalledOnce,
    wasNotCalled,
    wasCalledAtLeastOnce,
};

export function addMatchers() {
    // jasmine.addMatchers must be called in a before function so this will sometimes throw an error
    try {
        jasmine.addMatchers(matchers);
    } catch (e) {
        // NOP
    }
}

function wasCalled(): jasmine.CustomMatcher {
    return {
        compare: (actual: IFunctionVerifier<any, any>, times: number) => {
            if (typeof times !== 'number') {
                throw new Error(
                    `Expected call count must be passed to wasCalled(times: number). To verify that it was called at least once use wasCalledAtLeastOnce().`,
                );
            }

            return verifyFunctionCalled(times, actual) as any;
        },
    };
}

function wasCalledOnce(): jasmine.CustomMatcher {
    return {
        compare: (actual: IFunctionVerifier<any, any>) => {
            return verifyFunctionCalled(1, actual) as any;
        },
    };
}

function wasNotCalled(): jasmine.CustomMatcher {
    return {
        compare: (actual: IFunctionVerifier<any, any>) => {
            return verifyFunctionCalled(0, actual) as any;
        },
    };
}

function wasCalledAtLeastOnce(): jasmine.CustomMatcher {
    return {
        compare: (actual: IFunctionVerifier<any, any>) => {
            return verifyFunctionCalled(undefined, actual) as any;
        },
    };
}
