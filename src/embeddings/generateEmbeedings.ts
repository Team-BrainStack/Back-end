// import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

// export async function generateEmbedding(text: string): Promise<number[]> {
//   const response = await axios.post(
//     'https://api.mistral.ai/v1/embeddings',
//     {
//       model: 'text-embedding-mistral',
//       input: text,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   );
//   return response.data.data[0].embedding;
// }


import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export async function generateEmbedding(text: string) {
  // ✅ Add this console log before the request
  console.log('Sending to Mistral:', {
    inputPreview: text.slice(0, 80), // show only first 80 chars to keep clean
    key: process.env.MISTRAL_API_KEY?.slice(0, 8) + '...',
  });

  try {
    interface MistralEmbeddingResponse {
      data: { embedding: number[] }[];
    }

    const response = await axios.post(
      'https://api.mistral.ai/v1/embeddings',
      {
        model: 'mistral-embed', // or the correct model name if different
        input: text,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const responseData = response.data as MistralEmbeddingResponse;
    return responseData.data[0].embedding;
  } catch (error: any) {
    console.error('❌ Mistral Error:', error.response?.data || error.message);
    throw error;
  }
}

