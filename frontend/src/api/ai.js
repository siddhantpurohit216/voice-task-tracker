const CREATE_AI_URL = "http://localhost:5003/ai/ai/parse-create";
const EDIT_AI_URL = "http://localhost:5003/ai/ai/parse-edit";

export async function parseVoiceCreate(transcript) {
  const res = await fetch(CREATE_AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
  });

  if (!res.ok) throw new Error("AI parsing failed");
  return res.json();
}

export async function parseVoiceEdit(transcript, existingTask) {
  const res = await fetch(EDIT_AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript, existingTask }),
  });

  if (!res.ok) throw new Error("AI edit parsing failed");
  return res.json();
}