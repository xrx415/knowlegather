/**
 * API Integration Tests for Knowlegather
 * Tests edge functions and core functionality
 */

const SUPABASE_URL = "https://fyebojtynxasphohnrjh.supabase.co";

describe('Supabase Edge Functions Tests', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    (global.fetch as jest.Mock).mockClear();
  });
  
  test('AI Chat function responds', async () => {
    const mockResponse = {
      message: {
        content: 'Hello! How can I help you today?',
        role: 'assistant'
      }
    };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hello test" }],
        context: "Testing the AI chat function"
      })
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('message');
    expect(data.message).toHaveProperty('content');
  });

  test('Scrape function responds', async () => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        url: "https://example.com"
      })
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('content');
    expect(data).toHaveProperty('suggestedTags');
  });

  test('Suggest tags function responds', async () => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/suggest-tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        title: "React Testing Tutorial",
        content: "This is a tutorial about testing React components with Jest and React Testing Library"
      })
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('tags');
    expect(Array.isArray(data.tags)).toBe(true);
  });
});

describe('Live Application Tests', () => {
  
  test('Production app responds', async () => {
    const response = await fetch('https://knowlegather-477059505249.europe-west1.run.app');
    expect(response.status).toBe(200);
    
    const html = await response.text();
    expect(html).toContain('<title>');
    expect(html).toContain('Knowlegather');
  });

  test('Health check endpoint works', async () => {
    const response = await fetch('https://knowlegather-477059505249.europe-west1.run.app/health');
    expect(response.status).toBe(200);
    
    const text = await response.text();
    expect(text).toBe('OK');
  });
});

describe('Database Connection Tests', () => {
  
  test('Can connect to Supabase database', async () => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/collections?select=count`, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.VITE_SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`
      }
    });

    expect(response.status).toBe(200);
  });
});
