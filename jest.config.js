const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./packages/api/tsconfig.json')
const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths ?? {}, {
  prefix: '<rootDir>/packages/web/',
})

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: 'ts-jest',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['./test/jest-setup.ts'],
  moduleNameMapper,
  // testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/packages/native/',
    '<rootDir>/node_modules/',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/packages/shared/',
    '<rootDir>/packages/cms/',
    '<rootDir>/packages/api/helpers/console',
  ],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json',
    },
  },
}
