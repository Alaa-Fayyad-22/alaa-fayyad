/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
    // lenis ships ESM only (its dist/lenis.js is a browser IIFE, not CJS), so
    // the .mjs build has to be transpiled down for Jest's CJS runtime.
    '^.+\\.mjs$': ['ts-jest', {
      tsconfig: {
        allowJs: true,
        module: 'commonjs',
      },
    }],
  },
  transformIgnorePatterns: ['/node_modules/(?!lenis/)'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/fileMock.js',
    // Jest resolves the package to its IIFE build otherwise; point it at the ESM
    // entry that the transform above can actually handle.
    '^lenis$': '<rootDir>/node_modules/lenis/dist/lenis.mjs',
    // @vercel/analytics is ESM-only; lib/track.ts treats it as best-effort, so
    // a no-op `track` stub keeps component tests runnable.
    '^@vercel/analytics$': '<rootDir>/__mocks__/analyticsMock.js',
  },
};

module.exports = config;