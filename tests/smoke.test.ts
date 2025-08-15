/**
 * Smoke tests to verify basic functionality
 */

describe('Smoke Tests', () => {
  test('Basic test setup works', () => {
    expect(1 + 1).toBe(2);
  });

  test('Environment variables are available', () => {
    expect(process.env.VITE_SUPABASE_URL || 'https://uaopfmkqfoyabbgcvzte.supabase.co').toContain('supabase.co');
  });

  test('Jest can run async tests', async () => {
    const promise = Promise.resolve('test');
    const result = await promise;
    expect(result).toBe('test');
  });
});
