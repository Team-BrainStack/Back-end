import { Mistral } from "@mistralai/mistralai";
import { Pinecone } from "@pinecone-database/pinecone";

const mistralApiKey = process.env.MISTRAL_API_KEY as string;
const pineconeApiKey = process.env.PINECONE_API_KEY as string;

export const mistral = new Mistral({ apiKey: mistralApiKey});
export const pc = new Pinecone({ apiKey: pineconeApiKey });