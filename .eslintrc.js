module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    es2021: true,
    node: true
  },
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint', 'standard'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {}
};
