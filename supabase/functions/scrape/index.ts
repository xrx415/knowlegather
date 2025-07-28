import { createClient } from "npm:@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Common words to exclude from tag suggestions
const stopWords = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'the', 'this', 'but', 'they', 'have', 'had', 'what', 'when',
  'where', 'who', 'which', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
  'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'can', 'just', 'should', 'now'
]);

function extractTags(text: string, title: string): string[] {
  // Combine title and content, giving more weight to title words
  const combinedText = `${title} ${title} ${text}`.toLowerCase();
  
  // Split into words and count frequencies
  const words = combinedText.split(/\W+/);
  const wordFreq: { [key: string]: number } = {};
  
  words.forEach(word => {
    if (
      word.length > 3 && // Ignore short words
      !stopWords.has(word) && // Ignore stop words
      !/^\d+$/.test(word) // Ignore numbers
    ) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  // Sort by frequency and get top 5 words as tags
  return Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { 
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    const response = await fetch(url);
    const html = await response.text();

    // Basic HTML cleaning - remove scripts, styles and extract text
    const cleanedContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();

    // Get page title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extract tags from content
    const suggestedTags = extractTags(cleanedContent, title);

    return new Response(
      JSON.stringify({ 
        title,
        content: cleanedContent,
        suggestedTags
      }),
      { 
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
});