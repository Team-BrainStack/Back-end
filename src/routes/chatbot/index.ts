import { Hono } from "hono";
import { generateEmbedding } from "../../embeddings/generateEmbeedings";
import { pinecone } from "../../pinecone/client";
import { mistralChat } from "./mistralchat";


const app = new Hono();

app.get("/chatbot", async (c) => {
  const query = c.req.query("q");

  if (!query) {
    return c.json({ error: "Query parameter `q` is required" }, 400);
  }

  try {
    // Step 1: Embed the query
    const queryEmbedding = await generateEmbedding(query);

    // Step 2: Query Pinecone for similar vectors
    const index = pinecone.Index(process.env.PINECONE_INDEX!);
    const pineconeResult = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
    });

    const topMatches = pineconeResult.matches || [];
    const contextText = topMatches
      .map((match) => match.metadata?.content || "")
      .filter(Boolean)
      .join("\n\n");

    if (!contextText) {
      return c.json({ error: "No relevant memories found" }, 404);
    }

    // Step 3: Summarize using Mistral Large
    const prompt = `
You are an AI assistant helping a user with their question using the following memories:\n
${contextText}\n
Now answer the following question clearly:\n
"${query}"
`;

    const response = await mistralChat([
      {
        role: "user",
        content: prompt,
      },
    ]);

    return c.json({ response });
  } catch (error) {
    console.error("Chatbot error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
