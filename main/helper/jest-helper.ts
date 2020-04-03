import { proxyModule, WrappedModule } from './module-helper';

/**
 * Wraps an existing module and prepares it for use in jest.mock
 *
 * jest.mock('../../relativeImportPath', () =>
 *      require('@morgan-stanley/gpbit-torch-test-tools').proxyJestModule(
 *          require.resolve('../../relativeImportPath'),
 *      ),
 * );
 *
 * @param absolutePath
 */
export function proxyJestModule(absolutePath: string): WrappedModule {
    if (typeof jest !== 'object' || typeof jest.requireActual !== 'function') {
        throw new Error(`proxyJestModule can only be used when jest is available`);
    }
    const realModule = jest.requireActual(absolutePath);
    const wrappedModule = proxyModule(realModule);
    const brImport = jest.genMockFromModule(absolutePath);

    return { ...brImport, ...wrappedModule };
}
