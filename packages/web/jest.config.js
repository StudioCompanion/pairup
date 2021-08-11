module.exports = {
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['./test/jest-setup.ts'],
  transform: {
    '\\.tsx?$': [
      'babel-jest',
      {
        configFile: './.babelrc.jest.js',
      },
    ],
  },
}
