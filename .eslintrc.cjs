module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'prettier'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'no-restricted-syntax': 'off',
    'no-plusplus': 'off',
    'no-continue': 'off',
    'no-unused-vars': 'off',
  },
};
