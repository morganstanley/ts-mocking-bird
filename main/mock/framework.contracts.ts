// We copy types from frameworks here so we have no dependency on jest, jasmine or vitest when running in a consuming project that will not have types for these frameworks.

export interface ExpectExtend {
    extend: (matchers: Record<string, any>) => void;
}

/**
 * Copied here from Jest types to avoid the need for consuming projects to install Jest types
 */
export interface IJestCustomMatcherResult {
    pass: boolean;
    message: () => string;
}

/**
 * Copied here from Jasmine types to avoid the need for consuming projects to install Jasmine types
 */
export interface IJasmineCustomMatcherResult {
    pass: boolean;
    message?: string;
}

export interface ICustomMatcher {
    compare<T>(actual: T, expected: T, ...args: any[]): IJasmineCustomMatcherResult;
    compare(actual: any, ...expected: any[]): IJasmineCustomMatcherResult;
    negativeCompare?<T>(actual: T, expected: T, ...args: any[]): IJasmineCustomMatcherResult;
    negativeCompare?(actual: any, ...expected: any[]): IJasmineCustomMatcherResult;
}
