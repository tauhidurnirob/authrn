module.exports = {
  preset: 'react-native',
  // Disable Watchman — it crawls ios/Pods (thousands of files) and hangs
  // Jest indefinitely before any tests run on this machine.
  watchman: false,
  // Keep Jest out of native build directories during file collection.
  watchPathIgnorePatterns: [
    '<rootDir>/ios/Pods/',
    '<rootDir>/ios/build/',
    '<rootDir>/android/build/',
    '<rootDir>/android/app/build/',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/ios/build/',
    '<rootDir>/android/build/',
    '<rootDir>/android/app/build/',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/ios/',
    '<rootDir>/android/',
  ],
  // Allow Babel to transform packages that ship ES modules.
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native(-community)?|@react-native-vector-icons/.*|@react-navigation/.*)',
  ],
  // Stub binary/font assets so Jest doesn't choke on .ttf/.png inside node_modules.
  // Also intercept AsyncStorage globally to avoid the NativeModule null error in
  // all test files (including the default App.test.tsx).
  moduleNameMapper: {
    '\\.ttf$': '<rootDir>/node_modules/react-native/jest/assetFileTransformer.js',
    '@react-native-async-storage/async-storage':
      '<rootDir>/node_modules/@react-native-async-storage/async-storage/jest/async-storage-mock.js',
  },
};
