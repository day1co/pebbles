module.exports = {
  env: { jest: true },
  extends: '@day1co/eslint-config/common-ts',
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: '2021', sourceType: 'module' },
  plugins: ['import', '@typescript-eslint'],
  root: true,
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-namespace': 'off',
  },
};
