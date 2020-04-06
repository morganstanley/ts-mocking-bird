/**
 * An example interface that we want to mock
 */
export interface IMyService {
    propOne: string;
    propTwo: string;
    propThree?: number;
    functionOne: () => void;
    functionTwo: (value: string) => boolean;
    functionThree: () => string;
}

/**
 * An example class that we want to mock
 */
export class MyService implements IMyService {
    public static staticFunctionOne(paramOne: string, paramTwo: number): string {
        return `staticFunctionOne: ${paramOne} ${paramTwo}`;
    }
    public static staticPropOne: string = 'staticOne';
    public static staticPropTwo: number = 0;
    public propThree?: number | undefined;

    public propOne: string = '';
    public propTwo: string = '';

    // tslint:disable-next-line:no-empty
    constructor(_constrParamOne: string, _constrParamTwo: number) {}

    public functionTwo(_value: string) {
        return true;
    }

    // tslint:disable-next-line:no-empty
    public functionOne() {}

    public functionThree() {
        return 'returnValue';
    }
}

export function someFunction(): string {
    return 'someString';
}

export function someOtherFunction(): string {
    return 'someOtherString';
}
