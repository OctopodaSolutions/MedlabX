
// module.exports = {
//   transform: {
//     "^.+\\.[tj]sx?$": "babel-jest", // Adjusted regex for better compatibility
//   },
//   moduleNameMapper: {
//     "\\.css$": "identity-obj-proxy",
//     "\\.png$": "<rootDir>/src/__mocks__/fileMock.js",
//     "\\.jpg$": "<rootDir>/src/__mocks__/fileMock.js",
//     "\\.jpeg$": "<rootDir>/src/__mocks__/fileMock.js",
//     "\\.svg$": "<rootDir>/src/__mocks__/fileMock.js",
//     '^worker-loader!.+': '<rootDir>/src/__mocks__/worker-loader.js',
//   },
//   transformIgnorePatterns: [
//     "/node_modules/(?!axios)/", // Only transform axios in node_modules
//   ],
//   moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
//   testEnvironment: "jsdom",
//   setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
// };


module.exports = {
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
    "\\.png$": "<rootDir>/src/__mocks__/fileMock.js",
    "\\.jpg$": "<rootDir>/src/__mocks__/fileMock.js",
    "\\.jpeg$": "<rootDir>/src/__mocks__/fileMock.js",
    "\\.svg$": "<rootDir>/src/__mocks__/fileMock.js",
    "^worker-loader!.+": "<rootDir>/src/__mocks__/worker-loader.js",
  },
  transformIgnorePatterns: ["/node_modules/(?!axios)/"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  extensionsToTreatAsEsm: [".jsx"],
};
