import { PrismaClient } from "../../generated/prisma";
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { CreateMemory, DeleteMemoryById, GetAllMemories, GetMemoryById, GetMemoryByUserId, searchMemories, UpdateMemoryById } from "./controllers.js";
import { authenticationMiddleware } from "../middlewares/session-middleware.js";

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

const searchSchema = z.object({
  q: z.string().min(1),
});

memoryRouter.get(
  "/search",
  authenticationMiddleware,
  async (c) => {
    const result = searchSchema.safeParse(c.req.query());
    if (!result.success) {
      return c.json({ error: "Invalid query parameters" }, 400);
    }

    const { q } = result.data;
    const user = c.get("user")!;
    const data = await searchMemories(q, user.id);

    return c.json({ data });
  },
);



// Create a new memory
memoryRouter.post( "/create",
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


// memoryRouter.post("/create", async (c) => {
//   try {
//     const body = await c.req.json(); // Parse the body

//     // ✅ Optional: validate manually if zod middleware is not present
//     const parsed = memorySchema.safeParse(body);
//     if (!parsed.success) {
//       return c.json({ success: false, error: { message: "Invalid input", code: "INVALID_INPUT" } }, 400);
//     }

//     const result = await CreateMemory(parsed.data);

//     if (result.success) {
//       return c.json(result, 201);
//     } else {
//       const statusCode =
//         result.error.code === "USER_NOT_FOUND"
//           ? 404
//           : result.error.code === "MEMORY_EXISTS"
//           ? 409
//           : 400;
//       return c.json(result, statusCode);
//     }
//   } catch (err) {
//     return c.json({ success: false, error: { message: "Server error", code: "INTERNAL_ERROR" } }, 500);
//   }
// });


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
