export function buildPrompt(question: string, contexts: string[]): string {
  const contextText = contexts.map((ctx, idx) => `${idx + 1}. ${ctx}`).join('\n');
  return `Answer the following question using the provided context.\n\nContext:\n${contextText}\n\nQuestion: ${question}\n\nAnswer:`;
}
// export function buildPrompt(question: string, contexts: string[]) {
//   const contextText = contexts.join('\n---\n');

//   return `You are a helpful and formal AI assistant. Using the context below, provide a clear and concise answer in bullet points.

// Context:
// ${contextText}

// Question:
// ${question}

// Instructions:
// - Respond in a formal tone.
// - Format the answer using bullet points.
// - Do not repeat the context.
// - Do not fabricate information.
// - Do not include tags here.

// Answer:`;
// }
