
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://lovable.ai',
        'X-Title': 'Solace - Emotional Support App'
      },
      body: JSON.stringify({
        model: 'gryphe/mythomax-l2-13b',
        messages: [
          {
            role: 'system',
            content: `You are Solace, an AI emotional support companion designed for people navigating trauma or emotional distress. 
            Your responses should be gentle, compassionate, and nurturing - like a supportive friend.
            Keep responses short (2-3 lines maximum), warm, and focused on helping the user feel seen and supported.
            Never give medical advice or try to diagnose conditions.
            Focus on validation, grounding techniques, and gentle encouragement.
            If the user is in crisis, encourage them to reach out to professional help and provide crisis hotline information.`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      const aiResponse = data.choices[0].message.content;
      return new Response(JSON.stringify({ response: aiResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      throw new Error('Invalid response from AI API');
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
