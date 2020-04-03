import { proxyModule, registerMock, reset } from '../../main';

// tslint:disable:max-classes-per-file
describe('module-helper', () => {
    let params: { functionOneParams: string[]; functionTwoParams: string[] };

    beforeEach(() => {
        params = { functionOneParams: [], functionTwoParams: [] };
    });

    function createInitialModule() {
        return {
            functionOne: (param: string) => {
                params.functionOneParams.push(param);
                return 'return from function One';
            },
            functionTwo: (param: string) => {
                params.functionTwoParams.push(param);
                return 'return from function Two';
            },
            ModuleClass: class {
                public type = 'initialClass';
            },
        };
    }
    describe('proxyModule', () => {
        it('should return a module with wrapped functions and constructor', () => {
            const initialModule = createInitialModule();
            const wrappedModule = proxyModule(initialModule);

            expect(typeof wrappedModule.___moduleId).toBe('string');
            expect(wrappedModule.functionOne('paramOne')).toBe('return from function One');
            expect(wrappedModule.functionTwo('paramTwo')).toBe('return from function Two');
            expect(params.functionOneParams).toEqual(['paramOne']);
            expect(params.functionTwoParams).toEqual(['paramTwo']);
            expect(new wrappedModule.ModuleClass().type).toBe('initialClass');
            expect(new wrappedModule.ModuleClass() instanceof initialModule.ModuleClass).toBeTruthy();
        });
    });

    describe('registerMock', () => {
        it('should replace function implementations', () => {
            const wrappedModule = proxyModule(createInitialModule());

            const replacements: Partial<typeof wrappedModule> = {
                functionOne: () => 'return from replaced function One',
            };

            registerMock(wrappedModule, replacements);

            expect(wrappedModule.functionOne('paramOne')).toBe('return from replaced function One');
            expect(wrappedModule.functionTwo('paramTwo')).toBe('return from function Two');
            expect(params.functionOneParams).toEqual([]);
            expect(params.functionTwoParams).toEqual(['paramTwo']);
            expect(new wrappedModule.ModuleClass().type).toBe('initialClass');
        });

        it('should replace class constructors', () => {
            const wrappedModule = proxyModule(createInitialModule());

            const replacements: Partial<typeof wrappedModule> = {
                ModuleClass: class {
                    public type = 'mockedClass';
                },
            };

            registerMock(wrappedModule, replacements);

            expect(wrappedModule.functionOne('paramOne')).toBe('return from function One');
            expect(wrappedModule.functionTwo('paramTwo')).toBe('return from function Two');
            expect(params.functionOneParams).toEqual(['paramOne']);
            expect(params.functionTwoParams).toEqual(['paramTwo']);
            expect(new wrappedModule.ModuleClass().type).toBe('mockedClass');
        });

        it('should do nothing if module is not wrapped', () => {
            const initialModule = createInitialModule();

            const replacements: Partial<typeof initialModule> = {
                ModuleClass: class {
                    public type = 'mockedClass';
                },
                functionOne: () => 'return from replaced function One',
            };

            registerMock(initialModule, replacements);

            expect(initialModule.functionOne('paramOne')).toBe('return from function One');
            expect(initialModule.functionTwo('paramTwo')).toBe('return from function Two');
            expect(params.functionOneParams).toEqual(['paramOne']);
            expect(params.functionTwoParams).toEqual(['paramTwo']);
            expect(new initialModule.ModuleClass().type).toBe('initialClass');
        });
    });

    describe('reset', () => {
        it('should reset class and function implementatitons', () => {
            const wrappedModule = proxyModule(createInitialModule());

            const replacements: Partial<typeof wrappedModule> = {
                ModuleClass: class {
                    public type = 'mockedClass';
                },
                functionOne: () => 'return from replaced function One',
            };

            registerMock(wrappedModule, replacements);

            reset(wrappedModule);

            expect(typeof wrappedModule.___moduleId).toBe('string');
            expect(wrappedModule.functionOne('paramOne')).toBe('return from function One');
            expect(wrappedModule.functionTwo('paramTwo')).toBe('return from function Two');
            expect(params.functionOneParams).toEqual(['paramOne']);
            expect(params.functionTwoParams).toEqual(['paramTwo']);
            expect(new wrappedModule.ModuleClass().type).toBe('initialClass');
        });

        it('should do nothing if module is not wrapped', () => {
            const initialModule = createInitialModule();

            const replacements: Partial<typeof initialModule> = {
                ModuleClass: class {
                    public type = 'mockedClass';
                },
                functionOne: () => 'return from replaced function One',
            };

            registerMock(initialModule, replacements);
            reset(initialModule);

            expect(initialModule.functionOne('paramOne')).toBe('return from function One');
            expect(initialModule.functionTwo('paramTwo')).toBe('return from function Two');
            expect(params.functionOneParams).toEqual(['paramOne']);
            expect(params.functionTwoParams).toEqual(['paramTwo']);
            expect(new initialModule.ModuleClass().type).toBe('initialClass');
        });
    });
});
