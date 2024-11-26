// Jest configuration taken from: https://nextjs.org/docs/app/building-your-application/testing/jest

const nextJest = require('next/jest')

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

// This has been edited to allow for extra syntax and React
module.exports = {
  transformIgnorePatterns: ['node_modules/(?!(@react-hook/mouse-position|@react-hook/event)/)'],
  testEnvironment: 'jsdom', // Use jsdom for browser-like environment
  // ...the rest of your config
  preset: 'ts-jest/presets/js-with-ts',
  transform: {
    "^.+\\.js$": "babel-jest",
    ".+\\.(css)$": "jest-transform-stub"
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node']
}
