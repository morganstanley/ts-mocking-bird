import { Mock, setupFunction } from '../dist/main';

const mockedDate = Mock.create<Date>().setup(setupFunction('setHours'));

mockedDate.withFunction('setHours').withParameters(5);
