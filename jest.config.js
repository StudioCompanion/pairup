const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig.json')
const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: '<rootDir>/packages/web/',
})

module.exports = {
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['./test/jest-setup.ts'],
  moduleNameMapper,
}
