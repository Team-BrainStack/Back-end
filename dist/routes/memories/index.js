"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const zod_1 = require("zod");
const zod_validator_1 = require("@hono/zod-validator");
const controllers_js_1 = require("./controllers.js");
const memoryRouter = new hono_1.Hono();
/* ------------------------- Validators ------------------------- */
const memorySchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, "User ID is required"),
    content: zod_1.z.string().min(1, "Content is required"),
    title: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
const updateMemorySchema = zod_1.z.object({
    content: zod_1.z.string().min(1, "Content is required").optional(),
    title: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
/* ------------------------- Routes ------------------------- */
// Create a new memory
memoryRouter.post("/create", (0, zod_validator_1.zValidator)("json", memorySchema), async (c) => {
    const body = c.req.valid("json");
    const result = await (0, controllers_js_1.CreateMemory)(body);
    if (result.success) {
        return c.json(result, 201);
    }
    else {
        const statusCode = result.error.code === "USER_NOT_FOUND" ? 404 :
            result.error.code === "MEMORY_EXISTS" ? 409 : 400;
        return c.json(result, statusCode);
    }
});
// Get all memories
memoryRouter.get("/", async (c) => {
    const result = await (0, controllers_js_1.GetAllMemories)();
    return c.json(result);
});
// Get memory by memory ID
memoryRouter.get("/:id", async (c) => {
    const id = c.req.param("id");
    const result = await (0, controllers_js_1.GetMemoryById)(id);
    if (result.success) {
        return c.json(result);
    }
    else {
        const statusCode = result.error.code === "NOT_FOUND" ? 404 : 500;
        return c.json(result, statusCode);
    }
});
// Get memory by user ID
memoryRouter.get("/user/:userId", async (c) => {
    const userId = c.req.param("userId");
    const result = await (0, controllers_js_1.GetMemoryByUserId)(userId);
    if (result.success) {
        return c.json(result);
    }
    else {
        const statusCode = result.error.code === "NOT_FOUND" ? 404 : 500;
        return c.json(result, statusCode);
    }
});
// Update memory by memory ID
memoryRouter.patch("/:id", (0, zod_validator_1.zValidator)("json", updateMemorySchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const result = await (0, controllers_js_1.UpdateMemoryById)(id, body);
    if (result.success) {
        return c.json(result);
    }
    else {
        const statusCode = result.error.code === "NOT_FOUND" ? 404 : 500;
        return c.json(result, statusCode);
    }
});
// Delete memory by memory ID
memoryRouter.delete("/:id", async (c) => {
    const id = c.req.param("id");
    const result = await (0, controllers_js_1.DeleteMemoryById)(id);
    if (result.success) {
        return c.json(result);
    }
    else {
        const statusCode = result.error.code === "NOT_FOUND" ? 404 : 500;
        return c.json(result, statusCode);
    }
});
exports.default = memoryRouter;
