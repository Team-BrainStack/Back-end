import { Hono } from "hono";
import { prismaClient } from "../integrations/prisma";
import { authenticationMiddleware, createSecureRoute } from "../routes/middlewares/session-middleware";
import { mistral, pc } from "./pinecone";
import { z } from "zod";

type ChatMessage =
  | { role: "system"; content: string }
  | { role: "user"; content: string }
  | { role: "assistant"; content: string }
  | { role: "tool"; content: string };

const chatRoutesmistral = createSecureRoute();

const bodySchema = z.object({
  query: z.string().min(3),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional(),
});

chatRoutesmistral.post("/search", authenticationMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ success: false, message: "Invalid input." }, 400);
  }

  const { query, history } = parsed.data;

  // 🔍 Step 1: Search Pinecone for top relevant memory IDs
  const namespace = pc.index("second-brain").namespace(user.id);
  const pineconeResponse = await namespace.searchRecords({
    query: {
      inputs: { text: query },
      topK: 20,
    },
    rerank: {
      model: "bge-reranker-v2-m3",
      topN: 5,
      rankFields: ["text"],
    },
  });

  // 🎯 Step 2: Filter hits by score
  const relevantHits = pineconeResponse.result.hits
    .filter((hit) => hit._score && hit._score >= 0.1)
    .slice(0, 5);

  const ids = relevantHits.map((hit) => hit._id);

  // 🧠 Step 3: Fetch corresponding memories from DB
  const memoryRecords = await prismaClient.memory.findMany({
    where: {
      id: { in: ids },
      userId: user.id,
    },
  });

  const memoryMap = new Map(memoryRecords.map((m) => [m.id, m]));

  const results = relevantHits
    .map((hit) => memoryMap.get(hit._id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const contextText = results
    .map((m) => `- ${m.title || "Untitled"}: ${m.content}`)
    .join("\n");

  // 🧠 Build Chat Message History
  const safeHistory: ChatMessage[] = (history ?? []).map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const messages: ChatMessage[] = [
    ...safeHistory,
    {
      role: "user",
      content: `
You are MemoryVault, an intelligent assistant answering based on the user's saved memories only.

## USER QUESTION:
${query}

## CONTEXT FROM SAVED MEMORIES:
${contextText}

Answer clearly and concisely using only the context.
      `.trim(),
    },
  ];

  // 🤖 Step 4: Ask Mistral for a response
  const response = await mistral.chat.complete({
    model: "mistral-large-latest",
    messages,
  });

  const answer =
    response.choices?.[0]?.message?.content || "No answer generated.";

  return c.json({
    success: true,
    query,
    answer,
    references: results,
    meta: {
      count: results.length,
      threshold: 0.2,
    },
  });
});

export default chatRoutesmistral;
