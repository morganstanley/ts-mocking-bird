import { IMyService, MyService, someFunction } from './exampleImports';

/**
 * An example class that we want to test by mocking its constructor arguments
 */
export class ClassWithInstanceArgument {
    constructor(public readonly service: IMyService) {
        console.log(`SUT created`);
    }
}

/**
 * An example class that we want to test by mocking it's constructor arguments
 */
export class ClassWithConstructorArgument {
    public readonly service: IMyService;

    constructor(serviceConstructor: new (paramOne: string, paramTwo: number) => MyService) {
        this.service = new serviceConstructor('paramOne', 2);
    }
}

/**
 * An example class that we want to test by mocking it's constructor arguments
 */
export class ClassUsingImports {
    public readonly service: IMyService;

    constructor(paramOne: string, paramTwo: number) {
        this.service = new MyService(paramOne, paramTwo);
    }

    public someFunctionProxy() {
        return someFunction();
    }
}
