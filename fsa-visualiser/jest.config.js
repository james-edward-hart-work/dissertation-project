const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['node_modules/(?!(@react-hook/mouse-position|@react-hook/event)/)'],
  preset: 'ts-jest/presets/js-with-ts',
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest",
    ".+\\.(css|scss|sass)$": "jest-transform-stub",
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
};

module.exports = createJestConfig(customJestConfig);