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
You are an intelligent task parser. Extract structured task fields from natural language.

User said:
"${transcript}"

Your job:
1. Extract the title (short summary).
2. Extract a longer description if implied.
3. Extract and normalize priority:
   - "urgent", "critical", "asap", "important", "high priority" → High
   - "medium priority", "normal" → Medium
   - "low priority", "not urgent" → Low
   If unclear → "".

4. Extract and infer status:
   - "done", "completed", "finished" → Done
   - "in progress", "working on", "started" → In Progress
   Otherwise default → To Do
   If unclear → "".

5. Extract due_date:
   Understand relative dates:
     * tomorrow
     * day after tomorrow
     * in 3 days
     * next Monday
     * this Friday
   Understand absolute dates:
     * 15th January
     * Jan 20
     * 2025-01-20
   Understand deadline expressions:
     * due by Friday
     * before Friday
     * by tomorrow
   Convert the final date into ISO format YYYY-MM-DD.
   If no date → "".

Return ONLY a JSON object:
{
  "title": "",
  "description": "",
  "priority": "",
  "status": "",
  "due_date": ""
}

Do NOT add extra text.
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
You are updating an existing task.

Current task:
${JSON.stringify(existingTask, null, 2)}

User said:
"${transcript}"

Your job:
1. Update ONLY the fields the user explicitly wants to modify.
2. Do NOT include fields the user did not mention.
3. If the user says things like:
   - "keep the rest same"
   - "only change the title"
   - "edit only the due date"
   Then return ONLY the mentioned field(s).
4. Apply intelligent parsing:
   - PRIORITY SYNONYMS:
       urgent / critical / asap / important → High
       low priority / not urgent → Low
       medium priority → Medium
   - STATUS INFERENCE:
       done / completed / finished → Done
       in progress / working on → In Progress
   - DATE UNDERSTANDING:
       tomorrow
       day after tomorrow
       in 3 days
       next Monday
       this Friday
       due by Friday
       before Monday
     Convert all dates to ISO: YYYY-MM-DD.
5. If the user mentions multiple fields, update all of them.
6. If the user mentions no valid update, return {}.

OUTPUT:
Return ONLY a JSON object containing ONLY updated fields.
Example:
{ "status": "Done" }
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
