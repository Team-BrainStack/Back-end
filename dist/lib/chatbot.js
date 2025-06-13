"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../integrations/prisma");
const session_middleware_1 = require("../routes/middlewares/session-middleware");
const pinecone_1 = require("./pinecone");
const chatRoutesmistral = (0, session_middleware_1.createSecureRoute)();
chatRoutesmistral.get("/chat", async (c) => {
    const user = c.get("user");
    const { q: query } = c.req.query();
    if (!query || query.trim() === "") {
        return c.json({ success: false, message: "Query 'q' is required." }, 400);
    }
    // Step 1: Search Pinecone for relevant memories
    const namespace = pinecone_1.pc.index("second-brain").namespace(user.id);
    const pineconeResponse = await namespace.searchRecords({
        query: {
            inputs: { text: query },
            topK: 20, // broader search
        },
        rerank: {
            model: "bge-reranker-v2-m3",
            topN: 5,
            rankFields: ["text"],
        },
    });
    // Step 2: Filter hits based on score
    const relevantHits = pineconeResponse.result.hits.filter((hit) => hit._score && hit._score >= 0.2);
    const ids = relevantHits.map((hit) => hit._id);
    // Step 3: Fetch full memory data from Supabase (via Prisma)
    const memoryRecords = await prisma_1.prismaClient.memory.findMany({
        where: {
            id: { in: ids },
            userId: user.id,
        },
    });
    const memoryMap = new Map(memoryRecords.map((m) => [m.id, m]));
    const results = relevantHits
        .map((hit) => memoryMap.get(hit._id))
        .filter((m) => Boolean(m)); // Type narrowing
    // Step 4: Construct context for Mistral
    const contextText = results
        .map((m) => `- ${m.title || "Untitled"}: ${m.content}`)
        .join("\n");
    const prompt = `
## QUERY
${query}
---
## CONTEXT
${contextText}
`.trim();
    // Step 5: Mistral API for answer
    const response = await pinecone_1.mistral.chat.complete({
        model: "mistral-small-latest",
        messages: [{ role: "user", content: prompt }],
    });
    const summary = response.choices?.[0]?.message?.content || "No summary generated.";
    return c.json({
        success: true,
        query,
        summary,
        results,
        meta: {
            count: results.length,
            threshold: 0.2,
        },
    });
});
exports.default = chatRoutesmistral;
