import { generateAIQuestions as generateFromOpenRouter } from '../config/openrouter.js';

export const createAIPrompt = (question, topic, concept, difficulty, domain) => {
  return `
Generate 2 similar multiple-choice questions for educational assessment.

Context:
- Topic: ${topic}
- Concept: ${concept}
- Difficulty: ${difficulty}
- Domain: ${domain}

Reference Question: ${question}

Requirements:
1. Test the same concept with different scenarios
2. Maintain same difficulty level
3. Four options each (mark one as correct)
4. Include brief explanations
5. Return valid JSON array only

Format:
[
  {
    "questionText": "...",
    "options": [
      {"text": "...", "isCorrect": false},
      {"text": "...", "isCorrect": true},
      {"text": "...", "isCorrect": false},
      {"text": "...", "isCorrect": false}
    ],
    "correctAnswer": "...",
    "explanation": "..."
  }
]
`;
};

export const parseAIResponse = (response) => {
  try {
    const cleaned = response.replace(/``````\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    throw new Error('Failed to parse AI response');
  }
};
