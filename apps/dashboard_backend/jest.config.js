/**
 * Jest configuration for dashboard_backend.
 *
 * The source tree is ESM ("type": "module") with NodeNext resolution, so
 * imports look like `./foo.js` even though the file on disk is `foo.ts`.
 * The moduleNameMapper strips that `.js` so ts-jest can resolve them.
 * Run with NODE_OPTIONS=--experimental-vm-modules (see package.json).
 */

/** @type {import('jest').Config} */
export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  rootDir: ".",
  roots: ["<rootDir>/tests"],
  setupFiles: ["<rootDir>/tests/setup.env.ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          module: "ESNext",
          moduleResolution: "Bundler",
          target: "ES2020",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          strict: true,
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
        },
      },
    ],
  },
  testMatch: ["**/tests/**/*.test.ts"],
  clearMocks: true,
};
