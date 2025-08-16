// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

declare const Deno: any;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error("Messages array is required");
    }

    const apiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!apiKey) {
      console.error('OpenRouter API key is missing');
      throw new Error("OpenRouter API key is not configured");
    }

    // Prepare system message with context
    const systemMessage = {
      role: "system",
      content: `You are an AI assistant helping with a knowledge management system. ${
        context ? `Current context: ${context}` : ''
      }`
    };

    // Add system message at the beginning
    const fullMessages = [systemMessage, ...messages];

    console.log('Sending request to OpenRouter with messages:', JSON.stringify(fullMessages));

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://knowlegathor.com",
        "X-Title": "Knowlegathor"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku:beta",
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error:', errorData);
      throw new Error(errorData.error?.message || `Failed to get AI response: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Received response from OpenRouter:', JSON.stringify(data));

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenRouter API');
    }

    return new Response(
      JSON.stringify({ 
        message: {
          role: "assistant",
          content: data.choices[0].message.content
        }
      }),
      { 
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error('Error in AI chat:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
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
