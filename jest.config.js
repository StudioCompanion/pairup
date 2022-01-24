const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./packages/api/tsconfig.json')
const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths ?? {}, {
  prefix: '<rootDir>/packages/web/',
})

module.exports = {
  preset: 'ts-jest',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['./test/jest-setup.ts'],
  moduleNameMapper,
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/packages/native/'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json',
    },
  },
}
