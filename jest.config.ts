import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "src/test.js" // Ignore ce fichier (test bdd)
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/test.js"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover"],
  reporters: [
    "default",
    [
      "jest-sonar-reporter",
      {
        "reportFile": "coverage/sonar-report.xml",
        "indent": 4
      }
    ]
  ]
};

export default config;
