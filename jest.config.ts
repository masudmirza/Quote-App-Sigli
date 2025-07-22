import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json"],
  rootDir: "./src",
  testMatch: ["**/__tests__/**/*.test.ts"],
  clearMocks: true,
  setupFilesAfterEnv: [],
};

export default config;
