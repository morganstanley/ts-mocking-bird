import { Mock, setupFunction } from '../dist/main/index.js';

const mockedDate = Mock.create<Date>().setup(setupFunction('setHours'));

mockedDate.withFunction('setHours').withParameters(5);
