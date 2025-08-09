/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // Mapeamento para que o Jest entenda os imports com '@/'
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
};