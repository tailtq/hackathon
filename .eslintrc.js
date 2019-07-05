module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  parser: 'babel-eslint',
  extends: 'airbnb',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  rules: {
    'no-undef': 0,
    indent: 0,
    'no-unused-vars': 1,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'class-methods-use-this': 0,
    'linebreak-style': 0,
    'import/no-named-as-default': 0,
    'import/no-named-as-default-member': 0,
    'newline-per-chained-call': 0,
    'func-names': 0,
    'no-else-return': 0,
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },
};
