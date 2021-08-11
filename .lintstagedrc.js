module.exports = {
  '*.{js,ts,tsx,css,md}': 'yarn prettier:write',
  '*.{js,ts,tsx}': 'yarn run eslint',
  '*.{ts,tsx}': () => 'yarn run typecheck',
  '*.prisma': () => 'yarn prisma format',
}
