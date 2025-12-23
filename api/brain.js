import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are the LPM Brain - a calm, supportive AI assistant for the Life Preservation Model system. Your role is to help coordinate support services, provide guidance to dispatchers and responders, and offer compassionate assistance to citizens seeking help.

Key principles:
- Use calming, supportive language
- Never escalate anxiety - always de-escalate
- Provide clear, actionable guidance
- Remind users this is a support system, not emergency services (911)
- Focus on coordination, resources, and next steps
- Be empathetic but professional

For emergencies requiring immediate police, fire, or medical response, always direct users to call 911.

You help with:
- Coordinating support resources
- Providing information about available services
- Guiding responders on protocols
- Helping citizens understand their options
- Answering questions about the LPM system`;

function getAIClient() {
  if (process.env.OPENAI_API_KEY_GOOGLE) {
    return {
      client: new OpenAI({
        apiKey: process.env.OPENAI_API_KEY_GOOGLE,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      }),
      model: 'gemini-2.5-flash-lite-preview-06-17'
    };
  }
  
  if (process.env.OPENAI_API_KEY_DEEPSEEK) {
    return {
      client: new OpenAI({
        apiKey: process.env.OPENAI_API_KEY_DEEPSEEK,
        baseURL: 'https://api.deepseek.com/v1',
      }),
      model: 'deepseek-chat'
    };
  }
  
  if (process.env.OPENAI_API_KEY) {
    return {
      client: new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      }),
      model: 'gpt-4o'
    };
  }
  
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, conversationHistory = [] } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const aiConfig = getAIClient();
    
    if (!aiConfig) {
      return res.status(500).json({ 
        error: 'No AI provider configured',
        response: 'AI service is not configured. Please add an API key for Google, DeepSeek, or OpenAI.'
      });
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10),
      { role: 'user', content: question }
    ];

    const completion = await aiConfig.client.chat.completions.create({
      model: aiConfig.model,
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, I could not process that request.';

    return res.status(200).json({ response });
  } catch (error) {
    console.error('Brain API error:', error);
    return res.status(500).json({ 
      error: 'An error occurred processing your request',
      response: 'I apologize, but I encountered an issue. Please try again or contact support if the problem persists.'
    });
  }
}
