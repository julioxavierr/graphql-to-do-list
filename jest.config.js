const ignoredPaths = [
  '<rootDir>/node_modules/',
  '<rootDir>/dist',
  '<rootDir>/scripts',
  '<rootDir>/repl/',
  '<rootDir>/test/',
];

module.exports = {
  displayName: 'test',
  testEnvironment: '<rootDir>/test/environment/mongodb',
  testPathIgnorePatterns: ignoredPaths,
  coverageReporters: ['lcov', 'html'],
  setupTestFrameworkScriptFile: '<rootDir>/test/setupTestFramework.js',
  globalSetup: '<rootDir>/test/setup.js',
  globalTeardown: '<rootDir>/test/teardown.js',
  resetModules: false,
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'GraphQL Dataloader Boilerplate TS Tests',
        output: './test-results/jest/results.xml',
      },
    ],
  ],
  transform: {
    '^.+\\.(js|ts|tsx)?$': '<rootDir>/node_modules/babel-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts|tsx)?$',
  moduleFileExtensions: ['ts', 'js', 'tsx'],
};