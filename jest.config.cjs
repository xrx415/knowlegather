module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'import.meta': {
      env: {
        VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || 'https://uaopfmkqfoyabbgcvzte.supabase.co',
        VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || 'test-key',
      }
    }
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/main.tsx',
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
    '<rootDir>/tests/**/*.{test,spec}.{ts,tsx}',
    '<rootDir>/supabase/**/*.{test,spec}.{ts,tsx}',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(@testing-library|jest)/)'
  ],
};
