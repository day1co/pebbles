module.exports = {
  coverageDirectory: '../coverage',
  preset: 'ts-jest',
  rootDir: './src',
  testEnvironment: 'node',
  transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
};
