/* eslint-disable prettier/prettier */
/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(tsx?|ts?)$": ["ts-jest", {}],
  },
  testMatch: ["**/*.test.ts"], 
};
