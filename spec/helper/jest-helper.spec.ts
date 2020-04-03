import { proxyJestModule } from '../../main';

describe('jest-helper', () => {
    afterEach(() => delete (window as any).jest);

    describe('proxyJestModule', () => {
        it('should throw error if jest not available', () => {
            expect(() => proxyJestModule('myModulePath')).toThrowError(
                'proxyJestModule can only be used when jest is available',
            );
        });

        it('should return wrapped module if jest is available', () => {
            let requiredPath: string | undefined;
            let generatePath: string | undefined;
            (window as any).jest = {
                requireActual: (path: string) => {
                    requiredPath = path;
                    return {
                        actualModule: true,
                    };
                },
                genMockFromModule: (path: string) => {
                    generatePath = path;
                    return {
                        genratedModule: true,
                    };
                },
            };

            const wrappedModule: any = proxyJestModule('myModulePath');

            expect(requiredPath).toEqual('myModulePath');
            expect(generatePath).toEqual('myModulePath');

            expect(wrappedModule.actualModule).toBe(true);
            expect(wrappedModule.genratedModule).toBe(true);
            expect(typeof wrappedModule.___moduleId).toBe('string');
        });
    });
});
