const AI_URL = "http://localhost:5003/ai/parse";

export async function parseVoice(transcript) {
  const res = await fetch(AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
  });

  if (!res.ok) throw new Error("AI parsing failed");

  return res.json();
}
