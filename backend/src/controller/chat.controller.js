import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Debug statements for environment variables
console.log('Environment check:');
console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
console.log('GROQ_API_KEY length:', process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0);

if (!process.env.GROQ_API_KEY) {
  console.error('GROQ_API_KEY is not set in environment variables');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Test Groq connection
const testGroqConnection = async () => {
  try {
    const testCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Test connection' }],
      model: 'mixtral-8x7b-32768',
      max_tokens: 10,
    });
    console.log('✅ Groq API connection successful');
    return true;
  } catch (error) {
    console.error('❌ Groq API connection failed:', error.message);
    return false;
  }
};

// Test connection on startup
testGroqConnection();

const systemPrompt = `You are an empathetic AI therapist assistant. Your role is to:
1. Listen carefully to users sharing their emotional struggles
2. Provide supportive and understanding responses
3. Offer gentle guidance and coping strategies when appropriate
4. Maintain a compassionate and non-judgmental tone
5. Encourage professional help when necessary
6. Never give medical advice or try to diagnose conditions

Remember to:
- Validate their feelings
- Show empathy and understanding
- Focus on emotional support
- Be patient and gentle
- Maintain appropriate boundaries`;

export const chatWithAI = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid messages format received:', messages);
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing in environment');
      return res.status(500).json({ error: 'GROQ_API_KEY is not configured' });
    }

    console.log('Attempting to send request to Groq API with messages:', messages);

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.8,
    });

    console.log('Received response from Groq API:', {
      status: 'success',
      hasChoices: !!completion?.choices,
      choicesLength: completion?.choices?.length,
    });

    if (!completion || !completion.choices || !completion.choices[0]) {
      console.error('Invalid response from Groq API:', completion);
      return res.status(500).json({ error: 'Invalid response from AI service' });
    }

    const response = completion.choices[0]?.message?.content || "I apologize, but I'm having trouble responding right now. Please try again.";

    res.json({ message: response });
  } catch (error) {
    console.error('Chat API Error Details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });
    const errorMessage = error.response?.data?.error || error.message || 'Failed to process chat message';
    res.status(500).json({ error: errorMessage });
  }
}; 