import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        reporters: ['default'],
        globals: true,
        setupFiles: 'spec/test-setup.ts',
    },
});
