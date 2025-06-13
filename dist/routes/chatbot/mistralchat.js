"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mistralChat = mistralChat;
const axios_1 = __importDefault(require("axios"));
async function mistralChat(messages) {
    const apiKey = process.env.MISTRAL_API_KEY;
    const res = await axios_1.default.post("https://api.mistral.ai/v1/chat/completions", {
        model: "mistral-large-latest",
        messages,
    }, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
    });
    return res.data.choices[0].message.content.trim();
}
