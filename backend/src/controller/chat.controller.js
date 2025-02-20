import dotenv from 'dotenv';

dotenv.config();

let groq = null;
let isGroqAvailable = false;

try {
  const { Groq } = await import('groq-sdk');
  if (process.env.GROQ_API_KEY) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    isGroqAvailable = true;
    console.log('✅ Groq API initialized successfully');
  } else {
    console.log('⚠️ GROQ_API_KEY not found, AI chat features will be disabled');
  }
} catch (error) {
  console.log('⚠️ Groq SDK not available, AI chat features will be disabled');
}

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
- Maintain appropriate boundaries
- Responses should be short and maximum 100 words`;

export const chatWithAI = async (req, res) => {
  if (!isGroqAvailable) {
    return res.status(503).json({ 
      error: 'AI chat service is currently unavailable',
      message: 'The AI chat feature is not configured. Please try again later.'
    });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

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

    if (!completion?.choices?.[0]?.message?.content) {
      return res.status(500).json({ error: 'Invalid response from AI service' });
    }

    const response = completion.choices[0].message.content;
    res.json({ message: response });
  } catch (error) {
    console.error('Chat API Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      message: 'There was an error processing your message. Please try again.'
    });
  }
}; 