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
        model: "openai/gpt-oss-20b", // SAME MODEL AS PYTHON
        messages: [
          {
            role: "user",
            content: `
Extract task details from this description:

"${transcript}"

Return ONLY a valid JSON object with fields:
{
  "title": "...",
  "description": "...",
  "priority": "...",
  "status": "...",
  "due_date": "YYYY-MM-DD"
}

If something is missing, use an empty string.
No explanations. Only JSON.
`
          }
        ],
        temperature: 0.2,
      });

      let raw = completion.choices[0].message.content.trim();

      // Cleanup in case model wraps response in markdown
      raw = raw.replace(/```json|```/g, "").trim();

      const data = JSON.parse(raw);

      return res.json(data);

    } catch (err) {
      console.error("🛑 Groq AI error:", err);
      return res.status(500).json({
        error: err.message,
        details: err.error
      });
    }
  }
};
