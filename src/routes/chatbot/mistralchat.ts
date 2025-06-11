import axios from "axios";

export async function mistralChat(messages: { role: string; content: string }[]) {
  const apiKey = process.env.MISTRAL_API_KEY!;
  
  const res = await axios.post(
    "https://api.mistral.ai/v1/chat/completions",
    {
      model: "mistral-large-latest",
      messages,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.choices[0].message.content.trim();
}
