const { createDefaultPreset } = require("ts-jest");

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json"],
  rootDir: "./src",
  testMatch: ["**/__tests__/**/*.test.ts"],
  clearMocks: true,
  setupFilesAfterEnv: [],
};
