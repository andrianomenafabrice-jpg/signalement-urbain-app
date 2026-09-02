/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  clearMocks: true,
  testTimeout: 20000,
  forceExit: true,
  collectCoverageFrom: ['src/services/statut.service.ts'],
  coverageThreshold: {
    'src/services/statut.service.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};