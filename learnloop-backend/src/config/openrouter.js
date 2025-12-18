import axios from 'axios';

export const generateAIQuestions = async (prompt, model = null) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error('❌ OPENROUTER_API_KEY not found in environment variables');
      throw new Error('OpenRouter API key not configured in .env file');
    }

    console.log('🤖 Calling OpenRouter API...');
    console.log('📋 Model:', model || process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat');

    const response = await axios({
      method: 'POST',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
        'X-Title': 'LearnLoop AI',
        'Content-Type': 'application/json'
      },
      data: {
        model: model || process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational content creator. Generate high-quality multiple-choice questions based on the provided context. You must return ONLY a valid JSON array. Do not include markdown formatting, code blocks, or any explanatory text. Return raw JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      timeout: 60000
    });

    console.log('✅ OpenRouter API Response received');
    return response.data.choices[0].message.content;

  } catch (error) {
    console.error('❌ OpenRouter API Error Details:');
    
    if (error.response) {
      console.error('Status Code:', error.response.status);
      console.error('Error Message:', error.response.data?.error?.message || 'Unknown error');
      
      if (error.response.status === 401) {
        throw new Error('Invalid OpenRouter API key');
      }
      if (error.response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later');
      }
      if (error.response.status === 402) {
        throw new Error('Insufficient credits in OpenRouter account');
      }
      
      throw new Error(`OpenRouter API error: ${error.response.data?.error?.message || 'Unknown error'}`);
    } else if (error.request) {
      console.error('❌ No response received from OpenRouter');
      throw new Error('Network error: Could not reach OpenRouter API');
    } else {
      console.error('❌ Error:', error.message);
      throw new Error(`Request setup error: ${error.message}`);
    }
  }
};

export const testOpenRouterConnection = async () => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error('❌ Cannot test: OPENROUTER_API_KEY not found');
      return false;
    }

    console.log('🧪 Testing OpenRouter connection...');
    
    const response = await axios({
      method: 'POST',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'LearnLoop AI Test',
        'Content-Type': 'application/json'
      },
      data: {
        model: 'deepseek/deepseek-chat',
        messages: [
          {
            role: 'user',
            content: 'Reply with just "OK"'
          }
        ],
        max_tokens: 10
      }
    });

    console.log('✅ OpenRouter connection successful!');
    return true;
  } catch (error) {
    console.error('❌ OpenRouter connection test failed');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data?.error?.message);
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
};

export default { generateAIQuestions, testOpenRouterConnection };
