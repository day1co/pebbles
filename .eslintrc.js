module.exports = {
  env: {
    jest: true,
    node: true,
  },
  extends: ['plugin:prettier/recommended', 'prettier', 'plugin:@typescript-eslint/recommended'],
  ignorePatterns: ['./lib'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['import', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-namespace': 'off',
  },
};
