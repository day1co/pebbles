module.exports = {
  env: {
    jest: true,
    node: true,
  },
  extends: ['plugin:prettier/recommended', 'plugin:@typescript-eslint/recommended'],
  ignorePatterns: ['./lib'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['import', '@typescript-eslint'],
  root: true,
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-namespace': 'off',
  },
};
