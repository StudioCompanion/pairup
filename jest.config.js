const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./packages/api/tsconfig.json')
const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths ?? {}, {
  prefix: '<rootDir>/packages/web/',
})

module.exports = {
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['./test/jest-setup.ts'],
  moduleNameMapper,
}
