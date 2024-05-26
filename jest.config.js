/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // roots: ['<rootDir>/tests'],
  preset: 'ts-jest',
  // testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(ts|js)x?$',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts']

};