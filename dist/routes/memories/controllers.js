"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMemoryById = exports.UpdateMemoryById = exports.GetMemoryByUserId = exports.GetMemoryById = exports.GetAllMemories = exports.CreateMemory = void 0;
const prisma_1 = require("../../generated/prisma");
const pinecone_1 = require("../../lib/pinecone");
const prisma = new prisma_1.PrismaClient();
/*export const CreateMemory = async (
  data: CreateMemoryInput
): Promise<Result<any>> => {
  try {
     Check if user exists
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
    
     Handle Prisma unique constraint violation
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
};*/
const CreateMemory = async (data) => {
    try {
        //Check if user exists
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
        //Insert into Pinecone
        const index = pinecone_1.pc.index("memories");
        const namespace = index.namespace(memory.userId);
        const records = [
            {
                id: memory.id,
                text: memory.content,
                title: memory.title || "",
            },
        ];
        await namespace.upsertRecords(records);
        return { success: true, data: memory };
    }
    catch (e) {
        console.error("CreateMemory Error:", e);
        //Handle Prisma unique constraint violation
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
exports.CreateMemory = CreateMemory;
const GetAllMemories = async () => {
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
    }
    catch (e) {
        console.error("GetAllMemories Error:", e);
        return {
            success: false,
            error: { message: "Failed to fetch memories", code: "FETCH_ERROR" },
        };
    }
};
exports.GetAllMemories = GetAllMemories;
const GetMemoryById = async (id) => {
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
    }
    catch (e) {
        console.error("GetMemoryById Error:", e);
        return {
            success: false,
            error: { message: "Failed to fetch memory", code: "FETCH_ERROR" },
        };
    }
};
exports.GetMemoryById = GetMemoryById;
const GetMemoryByUserId = async (userId) => {
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
    }
    catch (e) {
        console.error("GetMemoryByUserId Error:", e);
        return {
            success: false,
            error: { message: "Failed to fetch memory", code: "FETCH_ERROR" },
        };
    }
};
exports.GetMemoryByUserId = GetMemoryByUserId;
const UpdateMemoryById = async (id, data) => {
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
    }
    catch (e) {
        console.error("UpdateMemoryById Error:", e);
        return {
            success: false,
            error: { message: "Failed to update memory", code: "UPDATE_ERROR" },
        };
    }
};
exports.UpdateMemoryById = UpdateMemoryById;
const DeleteMemoryById = async (id) => {
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
    }
    catch (e) {
        console.error("DeleteMemoryById Error:", e);
        return {
            success: false,
            error: { message: "Failed to delete memory", code: "DELETE_ERROR" },
        };
    }
};
exports.DeleteMemoryById = DeleteMemoryById;
