import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const AiController = {
  async parseVoice(req, res) {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: "Transcript missing" });
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

Return ONLY a valid JSON object with fields:
{
  "title": "...",
  "description": "...",
  "priority": "...",
  "status": "...",
  "due_date": "YYYY-MM-DD"
}

If something is missing, return an empty string.
No extra text. Only raw JSON.
`
          }
        ],
        temperature: 0.2,
      });

      let raw = completion.choices[0].message.content.trim();
      raw = raw.replace(/```json|```/g, "").trim();

      return res.json(JSON.parse(raw));

    } catch (err) {
      console.error("🛑 AI CREATE error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /* ----------------------------------------------------
     EDIT MODE — Extract ONLY changed fields
  ---------------------------------------------------- */
  async parseEdit(req, res) {
    const { transcript, existingTask } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: "Transcript missing" });
    }

    if (!existingTask) {
      return res.status(400).json({ error: "existingTask missing" });
    }

    try {
      const completion = await client.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "user",
            content: `
You are updating an existing task.

Current task details:
${JSON.stringify(existingTask, null, 2)}

User said:
"${transcript}"

Your job:
1. Update ONLY the fields the user explicitly wants to modify.
2. Leave all other fields unchanged.
3. If user says "update everything" or mentions multiple fields, update them all.
4. If user mentions no valid updates, return {}.

Return ONLY a JSON object with updated fields.

Examples:

User: "change title to fix login"
Return: { "title": "fix login" }

User: "set priority high and due date next monday"
Return: { "priority": "High", "due_date": "2025-12-08" }

User: "update everything. title: fix auth, priority high, status done"
Return:
{
  "title": "fix auth",
  "priority": "High",
  "status": "Done"
}

If no changes are needed:
Return: {}
`
          }
        ],
        temperature: 0.2,
      });

      let raw = completion.choices[0].message.content.trim();
      raw = raw.replace(/```json|```/g, "").trim();

      return res.json(JSON.parse(raw));

    } catch (err) {
      console.error("🛑 AI EDIT error:", err);
      res.status(500).json({ error: err.message });
    }
  }
};
