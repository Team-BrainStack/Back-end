"use strict";
// import axios from 'axios';
// import dotenv from 'dotenv';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmbedding = generateEmbedding;
// dotenv.config();
// export async function generateEmbedding(text: string): Promise<number[]> {
//   const response = await axios.post(
//     'https://api.mistral.ai/v1/embeddings',
//     {
//       model: 'text-embedding-mistral',
//       input: text,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   );
//   return response.data.data[0].embedding;
// }
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
async function generateEmbedding(text) {
    // ✅ Add this console log before the request
    console.log('Sending to Mistral:', {
        inputPreview: text.slice(0, 80), // show only first 80 chars to keep clean
        key: process.env.MISTRAL_API_KEY?.slice(0, 8) + '...',
    });
    try {
        const response = await axios_1.default.post('https://api.mistral.ai/v1/embeddings', {
            model: 'mistral-embed', // or the correct model name if different
            input: text,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        const responseData = response.data;
        return responseData.data[0].embedding;
    }
    catch (error) {
        console.error('❌ Mistral Error:', error.response?.data || error.message);
        throw error;
    }
}
