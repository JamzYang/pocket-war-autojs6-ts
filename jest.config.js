/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // roots: ['<rootDir>/tests'],
  // preset: 'ts-jest',
  // testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(ts|js)x?$',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    // 使用 swc 转译 JavaScript 和 TypeScrit
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
    // 静态资源 stub 转译
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
        "jest-transform-stub",
  },
};