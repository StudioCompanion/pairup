module.exports = {
  apps: [
    {
      name: 'pairup-api',
      script: 'src/server/index.ts',
      interpreter: '../../node_modules/.bin/ts-node',
      interpreter_args: '-P ./tsconfig.json -r ts-node/register/transpile-only',
    },
  ],
}
