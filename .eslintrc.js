module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      files: ['babel.config.js'],
      parserOptions: {
        requireConfigFile: false,
      },
    },
  ],
};
