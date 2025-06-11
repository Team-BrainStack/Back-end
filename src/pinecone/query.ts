import { generateEmbedding } from '../embeddings/generateEmbeedings.js';
import { pinecone } from './client.js';


export async function queryPinecone(query: string, topK: number = 5) {
  const embedding = await generateEmbedding(query);
  const index = pinecone.Index(process.env.PINECONE_INDEX!);
  const result = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true,
  });
  return result.matches;
}
