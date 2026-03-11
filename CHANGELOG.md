# Changelog

## [2.0.0]

### Breaking Changes

- **Removed module replacement functionality** — The following exports have been removed:
  - `proxyModule`, `registerMock`, `reset`, `isWrappedModule`, `WrappedModule`
  - `proxyJestModule`
  - `replaceProperties`, `replacePropertiesBeforeEach`, `mockImports`, `mockImportsBeforeEach`, `IImportReplacement`
  - Framework specific module replacement functionality should be used instead such as `vi.mock`
- **Removed `uuid` dependency** — No longer a runtime dependency.
- **Package is now ESM** — Added `"type": "module"` to package.json. TypeScript `module` changed from `commonjs` to `nodenext`.

### Changed

- Migrated to ESM — all internal imports now use `.js` extensions, `moduleResolution` set to `nodenext`.

### Dependencies

- Removed `uuid` from production dependencies.
