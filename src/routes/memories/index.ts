import { PrismaClient } from "../../generated/prisma/index.js";
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { CreateMemory, DeleteMemoryById, GetAllMemories, GetMemoryById, GetMemoryByUserId, UpdateMemoryById } from "./controllers.js";

const memoryRouter = new Hono();

/* ------------------------- Validators ------------------------- */
const memorySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  content: z.string().min(1, "Content is required"),
  title: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const updateMemorySchema = z.object({
  content: z.string().min(1, "Content is required").optional(),
  title: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

/* ------------------------- Routes ------------------------- */

// Create a new memory
memoryRouter.post(
  "/create",
  zValidator("json", memorySchema),
  async (c) => {
    const body = c.req.valid("json");
    const result = await CreateMemory(body);
    
    if (result.success) {
      return c.json(result, 201);
    } else {
      const statusCode = result.error.code === "USER_NOT_FOUND" ? 404 : 
                        result.error.code === "MEMORY_EXISTS" ? 409 : 400;
      return c.json(result, statusCode);
    }
  }
);

// Get all memories
memoryRouter.get("/", async (c) => {
  const result = await GetAllMemories();
  return c.json(result);
});

// Get memory by memory ID
memoryRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await GetMemoryById(id);
  
  if (result.success) {
    return c.json(result);
  } else {
    const statusCode = result.error.code === "NOT_FOUND" ? 404 : 500;
    return c.json(result, statusCode);
  }
});

// Get memory by user ID
memoryRouter.get("/user/:userId", async (c) => {
  const userId = c.req.param("userId");
  const result = await GetMemoryByUserId(userId);
  
  if (result.success) {
    return c.json(result);
  } else {
    const statusCode = result.error.code === "NOT_FOUND" ? 404 : 500;
    return c.json(result, statusCode);
  }
});

// Update memory by memory ID
memoryRouter.patch(
  "/:id",
  zValidator("json", updateMemorySchema),
  async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const result = await UpdateMemoryById(id, body);
    
    if (result.success) {
      return c.json(result);
    } else {
      const statusCode = result.error.code === "NOT_FOUND" ? 404 : 500;
      return c.json(result, statusCode);
    }
  }
);

// Delete memory by memory ID
memoryRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await DeleteMemoryById(id);
  
  if (result.success) {
    return c.json(result);
  } else {
    const statusCode = result.error.code === "NOT_FOUND" ? 404 : 500;
    return c.json(result, statusCode);
  }
});

export default memoryRouter;
