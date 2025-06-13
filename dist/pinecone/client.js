"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pinecone = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const pinecone_1 = require("@pinecone-database/pinecone");
dotenv_1.default.config();
exports.pinecone = new pinecone_1.Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
    // Remove 'environment' if not supported by PineconeConfiguration
});
