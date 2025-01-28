/* eslint-disable @typescript-eslint/no-namespace */
import { IJasmineMatcher, IFunctionVerifier } from './contracts';
import { verifyFunctionCalled } from './verifiers';
import type { expect as vitestExpect } from 'vitest';

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

/* istanbul ignore next */
export async function addMatchers(expectParam?: jest.Expect | typeof vitestExpect): Promise<void> {
    // jasmine.addMatchers must be called in a before function so this will sometimes throw an error
    try {
        jasmine.addMatchers(matchers);
    } catch (e) {
        // NOP
    }

    try {
        ((expectParam ?? expect) as unknown as jest.Expect).extend({
            wasCalled: mapToCustomMatcher(wasCalled()),
            wasCalledOnce: mapToCustomMatcher(wasCalledOnce()),
            wasNotCalled: mapToCustomMatcher(wasNotCalled()),
            wasCalledAtLeastOnce: mapToCustomMatcher(wasCalledAtLeastOnce()),
        });
    } catch (e) {
        // NOP
    }
}

/* istanbul ignore next */
function mapToCustomMatcher(matcher: IJasmineMatcher) {
    return (context: IFunctionVerifier<any, any>, received: any, ...actual: any[]) => {
        const result = matcher.compare(context, received, ...actual);

        return {
            pass: result.pass,
            message: typeof result.message === 'function' ? result.message : () => result.message || 'failed',
        };
    };
}

function wasCalled(): IJasmineMatcher {
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

function wasCalledOnce(): IJasmineMatcher {
    return {
        compare: (actual: IFunctionVerifier<any, any>) => {
            return verifyFunctionCalled(1, actual) as any;
        },
    };
}

function wasNotCalled(): IJasmineMatcher {
    return {
        compare: (actual: IFunctionVerifier<any, any>) => {
            return verifyFunctionCalled(0, actual) as any;
        },
    };
}

function wasCalledAtLeastOnce(): IJasmineMatcher {
    return {
        compare: (actual: IFunctionVerifier<any, any>) => {
            return verifyFunctionCalled(undefined, actual) as any;
        },
    };
}
