import '@testing-library/jest-dom';

// Mock environment variables for tests
process.env.VITE_SUPABASE_URL = 'https://fyebojtynxasphohnrjh.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'test-key';
process.env.VITE_OPENROUTER_API_KEY = process.env.VITE_OPENROUTER_API_KEY || 'test-key';

// Mock fetch for tests that don't need real API calls
global.fetch = jest.fn();
