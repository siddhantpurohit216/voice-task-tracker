// services/ai.service.js
import Groq from "groq-sdk";
import { BadRequestError, InternalServerError } from "../utils/AppError.js";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const AiService = {

  async parseCreate(transcript) {
    if (!transcript) {
      throw new BadRequestError("Transcript missing");
    }

    try {
      const completion = await client.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "user",
            content: `
Extract full task details from this description:

"${transcript}"

Return ONLY a valid JSON object:
{
  "title": "",
  "description": "",
  "priority": "",
  "status": "",
  "due_date": "YYYY-MM-DD"
}
If missing, return "".
No explanation.
            `,
          },
        ],
        temperature: 0.2,
      });

      let raw = completion.choices[0].message.content.trim();
      raw = raw.replace(/```json|```/g, "").trim();

      return JSON.parse(raw);

    } catch (err) {
        console.error("AI CREATE ERROR:", err);
        if (err instanceof SyntaxError) {
        throw new BadRequestError("AI returned invalid JSON");
      }
      throw new InternalServerError("Failed to parse task from voice");
    }
  },


  async parseEdit(transcript, existingTask) {
    if (!transcript) throw new BadRequestError("Transcript missing");
    if (!existingTask) throw new BadRequestError("existingTask missing");

    try {
      const completion = await client.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "user",
            content: `
You are updating this task:
${JSON.stringify(existingTask, null, 2)}

User said:
"${transcript}"

Update only requested fields.
Return ONLY JSON of updated fields.
            `,
          },
        ],
        temperature: 0.2,
      });

      let raw = completion.choices[0].message.content.trim();
      raw = raw.replace(/```json|```/g, "").trim();

      return JSON.parse(raw);

    } catch (err) {
       console.error("AI Error (parseEdit):", err);

      if (err instanceof SyntaxError) {
        throw new BadRequestError("AI returned invalid JSON");
      }

      throw new InternalServerError("AI failed to process edit request");
    }
  }
};
