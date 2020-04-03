import { isEqual } from 'lodash';
import { IParameterMatcher } from './contracts';

export function isParameterMatcher(matcher: unknown): matcher is IParameterMatcher<any> {
    const typedMatcher = matcher as IParameterMatcher<any>;

    return (
        matcher != null &&
        typeof typedMatcher.expectedDisplayValue === 'string' &&
        typeof typedMatcher.isExpectedValue === 'function'
    );
}

/**
 * Checks that the value is not undefined.
 * This will pass if the value is null (like jasmine does).
 * actualValue !== undefined
 */
export function toBeDefined(): IParameterMatcher<any> {
    return {
        isExpectedValue: actualValue => actualValue !== undefined,
        expectedDisplayValue: '<mustBeDefined>',
    };
}

/**
 * Checks that the value is not undefined and not null.
 * actualValue != null
 */
export function hasValue(): IParameterMatcher<any> {
    return {
        isExpectedValue: actualValue => actualValue != null,
        expectedDisplayValue: '<hasValue>',
    };
}

/**
 * Compares the expected value to the actual value with a strict equality check.
 * actualValue === expectedValue
 *
 * @param expectedValue
 */
export function toBe(expectedValue: any): IParameterMatcher<any> {
    return {
        expectedDisplayValue: mapItemToString(expectedValue),
        isExpectedValue: actualValue => actualValue === expectedValue,
    };
}

/**
 * Checks that the expected value is equal to the actual value using deep object comparison.
 * actualValue => isEqual(actualValue, expectedValue)
 *
 * @param expectedValue
 */
export function toEqual(expectedValue: any): IParameterMatcher<any> {
    return {
        expectedDisplayValue: mapItemToString(expectedValue),
        isExpectedValue: actualValue => isEqual(actualValue, expectedValue),
    };
}

/**
 * Allows any value.
 */
export function any(): IParameterMatcher<any> {
    return {
        expectedDisplayValue: `<matchAny>`,
        isExpectedValue: () => true,
    };
}

/**
 * Returns a string representation of a value.
 * @param item
 */
export function mapItemToString(item: any): string {
    if (typeof item === 'string') {
        return `"${item}"`;
    }

    if (item === undefined) {
        return 'undefined';
    }

    return JSON.stringify(replaceValue(item));
}

function replaceObjectFunctions(item: any): any {
    if (item == null) {
        return item;
    }

    if (Array.isArray(item)) {
        return item.map(replaceValue);
    } else {
        const clonedItem = { ...item };
        Object.keys(item).forEach(key => (clonedItem[key] = replaceValue(item[key])));
        return clonedItem;
    }
}

// https://regex101.com/r/BIvQJG/2
const functionStringRegExp = /function\s*\([^)]*\)/;

function replaceValue(value: any) {
    switch (typeof value) {
        case 'function':
            const functionString = String(value);
            const regexpResult = functionStringRegExp.exec(functionString);

            return regexpResult != null ? regexpResult[0] : 'FUNCTION_BODY_REMOVED';

        case 'object':
            return replaceObjectFunctions(value);
    }

    return value;
}
