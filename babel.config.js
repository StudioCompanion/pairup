module.exports = {
  overrides: [
    {
      include: ['./packages/native'],
      presets: ['module:metro-react-native-babel-preset'],
    },
    {
      include: ['./packages/shared'],
      ignore: ['./packages/native'],
      comments: false,
      presets: [
        [
          '@babel/preset-env',
          {
            bugfixes: true,
            shippedProposals: true,
            loose: true,
            targets: {
              // check this later
              esmodules: true,
            },
          },
        ],
        [
          '@babel/preset-typescript',
          {
            allowDeclareFields: true,
          },
        ],
      ],
    },
  ],
}
