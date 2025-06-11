import { generateEmbedding } from '../embeddings/generateEmbeedings.js';
import { pinecone } from './client.js';

export async function upsertDocument(id: string, text: string, metadata: Record<string, any>) {
  const embedding = await generateEmbedding(text);
  const index = pinecone.Index(process.env.PINECONE_INDEX!);
  await index.upsert([
    {
      id,
      values: embedding,
      metadata,
    },
  ]);
}
