module.exports = {
  '*.{js,ts,tsx,css,md,graphql}': 'yarn prettier:write',
  '*.{js,ts,tsx}': 'yarn run eslint',
  '*.{ts,tsx}': () => 'yarn run test:ts',
  '*.prisma': () => 'yarn workspace @pairup/api prisma format',
}
