import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface MistralChatCompletionResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function queryLLM(prompt: string): Promise<string> {
  const response = await axios.post<MistralChatCompletionResponse>(
    'https://api.mistral.ai/v1/chat/completions',
    {
      model: 'mistral-large-latest',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.choices[0].message.content;
}
