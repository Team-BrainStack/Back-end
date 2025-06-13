"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pc = exports.mistral = void 0;
const mistralai_1 = require("@mistralai/mistralai");
const pinecone_1 = require("@pinecone-database/pinecone");
const mistralApiKey = process.env.MISTRAL_API_KEY;
const pineconeApiKey = process.env.PINECONE_API_KEY;
exports.mistral = new mistralai_1.Mistral({ apiKey: mistralApiKey });
exports.pc = new pinecone_1.Pinecone({ apiKey: pineconeApiKey });
