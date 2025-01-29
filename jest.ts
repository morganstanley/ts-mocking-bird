import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testMatch: ['**/spec/examples/*.spec.ts'],
};

export default config;
