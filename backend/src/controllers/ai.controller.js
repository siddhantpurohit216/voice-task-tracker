import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

import { AiService } from "../services/ai.service.js";

export const AiController = {

   async parseVoice(req, res) {
    const { transcript } = req.body;
    const result = await AiService.parseCreate(transcript);
    res.json(result);
  },

  async parseEdit(req, res) {
    const { transcript, existingTask } = req.body;
    const result = await AiService.parseEdit(transcript, existingTask);
    res.json(result);
  }
};
