const { config } = require('dotenv');
const { resolve } = require('path');

// Load test environment variables
config({ path: resolve(process.cwd(), '.env.test') });

// Mock window.fetch for Node.js environment
global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 200,
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Mock import.meta.env for Vite environment variables
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
      }
    }
  }
});
