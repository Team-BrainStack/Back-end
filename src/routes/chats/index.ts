import { prismaClient } from "../../integrations/prisma";
import { createSecureRoute } from "../middlewares/session-middleware";
import { z } from "zod";

const chatRoutes = createSecureRoute();

const newChatSchema = z.object({
  query: z.string().min(1),
  chatId: z.string().optional(),
});

chatRoutes.post("/search", async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const parsed = newChatSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ success: false, message: "Invalid input." }, 400);
  }

  const { query, chatId } = parsed.data;

  // Create or get chat session
  let session;
  if (chatId) {
    session = await prismaClient.chatSession.findUnique({ where: { id: chatId } });
    if (!session) {
      return c.json({ success: false, message: "Chat session not found." }, 404);
    }
  } else {
    session = await prismaClient.chatSession.create({
      data: {
        userId: user.id,
        title: query.slice(0, 30),
      },
    });
  }

  // Save user message
  await prismaClient.chatMessage.create({
    data: {
      chatId: session.id,
      role: "user",
      content: query,
    },
  });

  // Fake assistant response for demo (replace with Mistral logic)
  const answer = `Echo: ${query}`;

  // Save assistant response
  await prismaClient.chatMessage.create({
    data: {
      chatId: session.id,
      role: "assistant",
      content: answer,
    },
  });

  return c.json({
    success: true,
    chatId: session.id,
    answer,
  });
});

chatRoutes.get("/sessions", async (c) => {
  const user = c.get("user");
  const sessions = await prismaClient.chatSession.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
  return c.json({ success: true, sessions });
});

chatRoutes.get("/session/:id", async (c) => {
  const user = c.get("user");
  const chatId = c.req.param("id");

  const session = await prismaClient.chatSession.findUnique({
    where: { id: chatId },
    include: { messages: true },
  });

  if (!session || session.userId !== user.id) {
    return c.json({ success: false, message: "Not found" }, 404);
  }

  return c.json({ success: true, messages: session.messages });
});

export default chatRoutes;
