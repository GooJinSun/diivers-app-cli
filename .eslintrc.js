module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'prettier/prettier': [
      'error',
      {
        'no-inline-styles': false,
      },
    ],
    curly: 0,
    'react-native/no-inline-styles': 0,
  },
};
