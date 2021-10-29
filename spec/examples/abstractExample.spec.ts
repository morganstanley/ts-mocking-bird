import { Mock, setupFunction, setupStaticFunction } from '../../main';

abstract class MyAbstractClass {
    public static sampleStaticFunction() {
        //empty
    }

    public sampleFunction() {
        //empty
    }
}

describe('mock abstract classes', () => {
    it('should mock instance methods', () => {
        const mocked = Mock.create<MyAbstractClass>();

        mocked.setup(setupFunction('sampleFunction'));

        mocked.mock.sampleFunction();

        expect(mocked.withFunction('sampleFunction')).wasCalledOnce();
    });

    it('should mock static functions', () => {
        const mocked = Mock.create<MyAbstractClass, typeof MyAbstractClass>();

        mocked.setup(setupFunction('sampleFunction'));
        mocked.setup(setupStaticFunction('sampleStaticFunction'));

        mocked.mock.sampleFunction();
        mocked.mockConstructor.sampleStaticFunction();

        expect(mocked.withFunction('sampleFunction')).wasCalledOnce();
        expect(mocked.withStaticFunction('sampleStaticFunction')).wasCalledOnce();
    });
});
