import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();
const memoryRouter = new Hono();

/* ------------------------- Types ------------------------- */
type ErrorResult = {
  message: string;
  code: string;
};

type Result<T> =
  | { success: true; data: T }
  | { success: false; error: ErrorResult };

type CreateMemoryInput = {
  userId: string;
  content: string;
  title?: string;
  tags?: string[];
};

type UpdateMemoryInput = {
  content?: string;
  title?: string;
  tags?: string[];
};

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

/* ------------------------- Controllers ------------------------- */
const CreateMemory = async (
  data: CreateMemoryInput
): Promise<Result<any>> => {
  try {
    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: data.userId }
    });

    if (!userExists) {
      return {
        success: false,
        error: { message: "User not found", code: "USER_NOT_FOUND" },
      };
    }


    const memory = await prisma.memory.create({
      data: {
        userId: data.userId,
        content: data.content,
        title: data.title || null,
        tags: data.tags || [],
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          }
        }
      }
    });
    
    return { success: true, data: memory };
  } catch (e: any) {
    console.error("CreateMemory Error:", e);
    
    // Handle Prisma unique constraint violation
    if (e.code === 'P2002') {
      return {
        success: false,
        error: { message: "User already has a memory", code: "UNIQUE_CONSTRAINT_ERROR" },
      };
    }
    
    return {
      success: false,
      error: { message: "Failed to create memory", code: "CREATE_ERROR" },
    };
  }
};

const GetAllMemories = async (): Promise<Result<any>> => {
  try {
    const memories = await prisma.memory.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          }
        }
      }
    });
    return { success: true, data: memories };
  } catch (e) {
    console.error("GetAllMemories Error:", e);
    return {
      success: false,
      error: { message: "Failed to fetch memories", code: "FETCH_ERROR" },
    };
  }
};

const GetMemoryById = async (id: string): Promise<Result<any>> => {
  try {
    const memory = await prisma.memory.findUnique({ 
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          }
        }
      }
    });
    
    if (!memory) {
      return {
        success: false,
        error: { message: "Memory not found", code: "NOT_FOUND" },
      };
    }
    
    return { success: true, data: memory };
  } catch (e) {
    console.error("GetMemoryById Error:", e);
    return {
      success: false,
      error: { message: "Failed to fetch memory", code: "FETCH_ERROR" },
    };
  }
};

const GetMemoryByUserId = async (userId: string): Promise<Result<any>> => {
  try {
    const memory = await prisma.memory.findMany({ 
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          }
        }
      }
    });
    
    if (!memory || memory.length === 0) {
      return {
        success: false,
        error: { message: "Memory not found for this user", code: "NOT_FOUND" },
      };
    }
    
    return { success: true, data: memory };
  } catch (e) {
    console.error("GetMemoryByUserId Error:", e);
    return {
      success: false,
      error: { message: "Failed to fetch memory", code: "FETCH_ERROR" },
    };
  }
};
const UpdateMemoryById = async (
  id: string,
  data: UpdateMemoryInput
): Promise<Result<any>> => {
  try {
    // Check if memory exists
    const existingMemory = await prisma.memory.findUnique({
      where: { id }
    });

    if (!existingMemory) {
      return {
        success: false,
        error: { message: "Memory not found", code: "NOT_FOUND" },
      };
    }

    const memory = await prisma.memory.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          }
        }
      }
    });
    
    return { success: true, data: memory };
  } catch (e) {
    console.error("UpdateMemoryById Error:", e);
    return {
      success: false,
      error: { message: "Failed to update memory", code: "UPDATE_ERROR" },
    };
  }
};

const DeleteMemoryById = async (id: string): Promise<Result<any>> => {
  try {
    // Check if memory exists
    const existingMemory = await prisma.memory.findUnique({
      where: { id }
    });

    if (!existingMemory) {
      return {
        success: false,
        error: { message: "Memory not found", code: "NOT_FOUND" },
      };
    }

    await prisma.memory.delete({ where: { id } });
    return { success: true, data: { message: "Memory deleted successfully" } };
  } catch (e) {
    console.error("DeleteMemoryById Error:", e);
    return {
      success: false,
      error: { message: "Failed to delete memory", code: "DELETE_ERROR" },
    };
  }
};

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

/* ------------------------- Export ------------------------- */
export default memoryRouter;
