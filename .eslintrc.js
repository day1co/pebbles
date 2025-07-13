module.exports = {
  env: { 
    jest: true,
    node: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { 
    ecmaVersion: 2021, 
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'prettier'],
  root: true,
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-namespace': 'off',
    'prettier/prettier': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': 'error'
  }
};
