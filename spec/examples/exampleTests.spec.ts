import {
    defineProperty,
    defineStaticProperty,
    IMocked,
    Mock,
    setupFunction,
    setupProperty,
    setupStaticFunction,
} from '../../main';
import { ClassWithConstructorArgument, ClassWithInstanceArgument } from './exampleImplementation';
import { IMyService, MyService } from './exampleImports';

describe('create mocks', () => {
    it('should create a mocked service and instantiate system under test', () => {
        const mockedService: IMocked<IMyService> = Mock.create<IMyService>().setup(
            setupFunction('functionOne'), // allows the function to be called and allows verification of calls
            setupFunction('functionTwo', (value: string) => value === 'something'), // specifies return value
            setupProperty('propOne', 'initialValue'),
            defineProperty(
                'propTwo',
                () => 'getter return value',
                (value: string) => console.log(`setter called: ${value}`),
            ),
        );

        const systemUnderTest = new ClassWithInstanceArgument(mockedService.mock); // pass mock instance to system under test

        expect(systemUnderTest).toBeDefined();
        expect(systemUnderTest.service).toBe(mockedService.mock);
    });

    it('should mock a class with constructor and statics', () => {
        const mockedService = Mock.create<MyService, typeof MyService>().setup(
            setupStaticFunction('staticFunctionOne', () => 'mockedReturnValue'),
            defineStaticProperty('staticPropOne', () => 'mockedStaticGetter'),
            setupProperty('propOne', 'sampleValue'),
        );

        const systemUnderTest = new ClassWithConstructorArgument(mockedService.mockConstructor); // pass mock constructor to system under test

        expect(systemUnderTest).toBeDefined();
        expect(systemUnderTest.service.propOne).toEqual('sampleValue');
    });
});

describe('verify function calls', () => {
    it('should verify that a mocked function was called', () => {
        const mockedService: IMocked<IMyService> = Mock.create<IMyService>().setup(setupFunction('functionOne'));

        const systemUnderTest = new ClassWithInstanceArgument(mockedService.mock);

        systemUnderTest.service.functionOne();
        systemUnderTest.service.functionOne();
        systemUnderTest.service.functionOne();
        systemUnderTest.service.functionOne();
        systemUnderTest.service.functionOne();

        expect(systemUnderTest).toBeDefined();
        expect(mockedService.withFunction('functionOne')).wasCalled(5);
    });

    it('should verify that a mocked function was called with specific parameters', () => {
        const mockedService: IMocked<IMyService> = Mock.create<IMyService>().setup(setupFunction('functionTwo'));

        const systemUnderTest = new ClassWithInstanceArgument(mockedService.mock);

        systemUnderTest.service.functionTwo('someValue');

        expect(systemUnderTest).toBeDefined();
        expect(mockedService.withFunction('functionTwo').withParameters('someValue')).wasCalledOnce();
    });

    it('should verify that a mocked getter was called', () => {
        const mockedService: IMocked<IMyService> = Mock.create<IMyService>().setup(
            setupProperty('propOne', 'initialValue'),
        );

        const systemUnderTest = new ClassWithInstanceArgument(mockedService.mock);

        const value = systemUnderTest.service.propOne;

        expect(systemUnderTest).toBeDefined();
        expect(value).toEqual('initialValue');
        expect(mockedService.withGetter('propOne')).wasCalledOnce();
    });

    it('should verify that a mocked setter was called', () => {
        const mockedService: IMocked<IMyService> = Mock.create<IMyService>().setup(setupProperty('propOne'));

        const systemUnderTest = new ClassWithInstanceArgument(mockedService.mock);

        systemUnderTest.service.propOne = 'someValue';

        expect(systemUnderTest).toBeDefined();
        expect(mockedService.withSetter('propOne').withParameters('someValue')).wasCalledOnce();
    });

    it('should verify that a mocked function was called with specific parameters and was not called any other times', () => {
        const mockedService: IMocked<IMyService> = Mock.create<IMyService>().setup(setupFunction('functionTwo'));

        const systemUnderTest = new ClassWithInstanceArgument(mockedService.mock);

        systemUnderTest.service.functionTwo('someValue');

        expect(systemUnderTest).toBeDefined();
        expect(
            mockedService
                .withFunction('functionTwo')
                .withParameters('someValue')
                .strict(),
        ).wasCalledOnce();
    });

    it('should create and use a function verifier', () => {
        const mockedService: IMocked<IMyService> = Mock.create<IMyService>();
        const functionVerifier = mockedService.setupFunction('functionTwo');

        const systemUnderTest = new ClassWithInstanceArgument(mockedService.mock);

        systemUnderTest.service.functionTwo('someValue');

        expect(systemUnderTest).toBeDefined();
        expect(functionVerifier.withParameters('someValue')).wasCalledOnce();
    });
});
