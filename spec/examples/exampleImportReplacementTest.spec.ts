import { addMatchers, IMocked, Mock, replaceProperties, replacePropertiesBeforeEach, setupFunction } from '../../main';
import { ClassUsingImports } from './exampleImplementation';
import * as myImport from './exampleImports';
import { IMyService } from './exampleImports';

describe('replace imports', () => {
    const someFunctionMock = () => 'mockedReturnValue';

    beforeEach(() => {
        addMatchers();
    });

    replaceProperties(myImport, { someFunction: someFunctionMock });

    it('should replace function import', () => {
        const SUT = new ClassUsingImports('one', 2);

        expect(SUT.someFunctionProxy()).toEqual('mockedReturnValue'); // value comes from mock above, not original import
    });

    describe('create new mock before each test', () => {
        let mockService: IMocked<IMyService>;
        let mockPackage: IMocked<typeof myImport>;

        replacePropertiesBeforeEach(() => {
            mockService = Mock.create<IMyService>().setup(setupFunction('functionThree', () => 'mockedFunctionReturn'));
            mockPackage = Mock.create<typeof myImport>().setup(setupFunction('someFunction')); // recreate mocks for each test run to reset call counts

            return [{ package: myImport, mocks: { ...mockPackage.mock, MyService: mockService.mockConstructor } }];
        });

        it('so that we can assert number of calls', () => {
            const SUT = new ClassUsingImports('one', 2);

            expect(mockPackage.withFunction('someFunction')).wasNotCalled();

            SUT.someFunctionProxy();
            expect(mockPackage.withFunction('someFunction')).wasCalledOnce();

            expect(SUT.service.functionThree()).toEqual('mockedFunctionReturn');
        });
    });
});
