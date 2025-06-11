import express from 'express';
import { queryPinecone } from '../../pinecone/query';
import { buildPrompt } from '../../rag/buildprompt';
import { queryLLM } from '../../llm/queryLLM';


const router = express.Router();

router.post('/', async (req, res) => {
  const { question } = req.body;
  const matches = await queryPinecone(question);
  const contexts = matches.map((match: { metadata: { text: any; }; }) => String(match.metadata?.text ?? ''));
  const prompt = buildPrompt(question, contexts);
  const answer = await queryLLM(prompt);
  res.json({ answer, references: matches });
});

export default router;
