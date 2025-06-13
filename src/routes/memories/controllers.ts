import { Prisma, PrismaClient } from "../../generated/prisma";
import { pc } from "../../lib/pinecone";
import type { CreateMemoryInput, MemoryMetadata, Result, UpdateMemoryInput } from "./types";

const prisma = new PrismaClient();

export const CreateMemory = async (
  data: CreateMemoryInput
): Promise<Result<any>> => {
  try {
    const userExists = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!userExists) {
      return { success: false, error: { message: "User not found", code: "USER_NOT_FOUND" } };
    }

    const memory = await prisma.memory.create({
      data: {
        userId: data.userId,
        content: data.content,
        title: data.title || null,
        tags: data.tags || [],
      },
    });

    // ✅ Pinecone upsert with integrated embeddings
    await pc
  .index<MemoryMetadata>("second-brain")
  .namespace(memory.userId)
  .upsertRecords([
    {
      id: memory.id,
      title: memory.title || "",
      text: memory.content,
    },
  ]);


    return { success: true, data: memory };
  } catch (e: any) {
    console.error("CreateMemory Error:", e);
    return {
      success: false,
      error: { message: "Failed to create memory", code: "CREATE_ERROR" },
    };
  }
};

export const GetAllMemories = async (): Promise<Result<any>> => {
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

export const GetMemoryById = async (id: string): Promise<Result<any>> => {
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

export const GetMemoryByUserId = async (userId: string): Promise<Result<any>> => {
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

export const UpdateMemoryById = async (
  id: string,
  data: UpdateMemoryInput
): Promise<Result<any>> => {
  try {
    const existing = await prisma.memory.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: { message: "Memory not found", code: "NOT_FOUND" } };
    }

    const memory = await prisma.memory.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    // ✅ Re-index content if updated
    // For UpdateMemoryById
if (data.content) {
  await pc
  .index<MemoryMetadata>("second-brain")
  .namespace(memory.userId)
  .upsertRecords([
    {
      id: memory.id,
      title: memory.title || "",
      text: memory.content,
    },
  ]);
}


    return { success: true, data: memory };
  } catch (e: any) {
    console.error("UpdateMemoryById Error:", e);
    return {
      success: false,
      error: { message: "Failed to update memory", code: "UPDATE_ERROR" },
    };
  }
};

export const DeleteMemoryById = async (id: string): Promise<Result<any>> => {
  try {
     //Check if memory exists
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



export const searchMemories = async (
  query: string,
  userId: string,
) => {
  const filter = {
    userId,
    OR: [
      { title: { contains: query, mode: Prisma.QueryMode.insensitive } },
      { content: { contains: query, mode: Prisma.QueryMode.insensitive } },
      { tags: { has: query } },
    ],
  };

  const memories = await prisma.memory.findMany({
    where: filter,
    include: { user: { select: { id: true, username: true } } },
    orderBy: { createdAt: "desc" },
  });

  return memories;
};
