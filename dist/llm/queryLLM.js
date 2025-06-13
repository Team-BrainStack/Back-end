"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryLLM = queryLLM;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function queryLLM(prompt) {
    const response = await axios_1.default.post('https://api.mistral.ai/v1/chat/completions', {
        model: 'mistral-large-latest',
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    }, {
        headers: {
            Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data.choices[0].message.content;
}
