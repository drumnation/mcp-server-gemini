// This file is used for test setup only
process.env.NODE_ENV = 'test';

// Disable console.log during tests unless explicitly enabled
if (!process.env.DEBUG) {
  global.console.log = jest.fn();
} 