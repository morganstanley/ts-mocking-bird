import { any, Mock, setupFunction, toBe, toBeDefined } from '../../main';

describe('match function paramters', () => {
    interface IPerson {
        name: string;
        id: number;
    }

    interface ISampleMocked {
        functionOne(paramOne: string, paramTwo: number, paramThree: IPerson): void;
    }

    it('parameters should exactly match when withParameters used', () => {
        const sampleMock = Mock.create<ISampleMocked>().setup(setupFunction('functionOne'));

        const sampleObject: IPerson = { name: 'Fred', id: 1 };
        sampleMock.mock.functionOne('one', 2, sampleObject);

        sampleMock
            .withFunction('functionOne')
            .withParameters('one', 2, sampleObject) // strict equality
            .wasCalledOnce();
        sampleMock
            .withFunction('functionOne')
            .withParameters('one', 2, { name: 'Fred', id: 1 }) // strict equality
            .wasNotCalled();
    });

    it('parameters should equal value when withParametersEqualTo used', () => {
        const sampleMock = Mock.create<ISampleMocked>().setup(setupFunction('functionOne'));

        sampleMock.mock.functionOne('one', 2, { name: 'Fred', id: 1 });

        sampleMock
            .withFunction('functionOne')
            .withParametersEqualTo('one', 2, { name: 'Fred', id: 1 }) // equals used to match
            .wasCalledOnce();
    });

    it('alternate paramter matchers can be used', () => {
        const sampleMock = Mock.create<ISampleMocked>().setup(setupFunction('functionOne'));

        sampleMock.mock.functionOne('one', 2, { name: 'Fred', id: 1 });

        sampleMock
            .withFunction('functionOne')
            .withParameters('one', toBeDefined(), any())
            .wasCalledOnce();
    });

    it('parameter matcher functions can be used instead of default matchers', () => {
        /**
         * A parameter match function with the signature (value: T) => true can be used instead of standard matchers
         * This is a quick and easy way to add complex match logic but it doesn't provide an expected value string.
         * This means if the test fails you won't be given any information about what value was expected for the parameter
         */
        const sampleMock = Mock.create<ISampleMocked>().setup(setupFunction('functionOne'));

        sampleMock.mock.functionOne('one', 2, { name: 'Fred', id: 1 });

        sampleMock
            .withFunction('functionOne')
            .withParameters('one', 2, person => person.id === 1)
            .wasCalledOnce();
    });

    it('custom parameter matchers can be used to implement complex matching logic with better failure messages', () => {
        const sampleMock = Mock.create<ISampleMocked>().setup(setupFunction('functionOne'));

        sampleMock.mock.functionOne('one', 2, { name: 'Fred', id: 1 });

        sampleMock
            .withFunction('functionOne')
            .withParameters(toBe('one'), toBe(2), {
                isExpectedValue: person => person.id === 1,
                expectedDisplayValue: 'Person with id 1', // Used to display expected parameter value in failure message
                parameterToString: person => `Person with id ${person.id}`, // Used to display value of actual parameters passed in failure message
            })
            .wasCalledOnce();
    });
});
