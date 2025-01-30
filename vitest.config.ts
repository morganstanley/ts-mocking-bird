import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        reporters: ['default'],
        globals: true,
        include: ['**/spec/examples/*.spec.ts'],
        alias: {
            // this is required as we run vitest against precompiled source
            // we need to do this as setting the prototype of the mocked class constructor fails when compiling within vitest
            '../../main': '../../dist/main',
        },
    },
});
