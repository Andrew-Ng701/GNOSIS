const USE_REAL_AI = String(import.meta.env.VITE_USE_REAL_AI) === "true";
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL =
  import.meta.env.VITE_OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
const OPENROUTER_MODEL =
  import.meta.env.VITE_OPENROUTER_MODEL || "stepfun/step-3.5-flash:free";

export function canUseRealAI() {
  return Boolean(USE_REAL_AI && OPENROUTER_API_KEY && OPENROUTER_BASE_URL);
}

export async function getEssayCoachReply(messages, profile) {
  if (!canUseRealAI()) {
    return smartLocalReply(messages, profile);
  }

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: buildSystemPrompt(profile) },
        ...messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  return (
    data?.choices?.[0]?.message?.content?.trim() ||
    "I’m here to help with your essays and applications."
  );
}

export async function streamEssayCoachReply(messages, profile, onDelta) {
  if (!canUseRealAI()) {
    const fallback = smartLocalReply(messages, profile);
    onDelta(fallback);
    return fallback;
  }

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      stream: true,
      messages: [
        { role: "system", content: buildSystemPrompt(profile) },
        ...messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `OpenRouter streaming error: ${response.status}`);
  }

  if (!response.body) {
    throw new Error("Streaming not supported in this browser.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullText = "";
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;

      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") {
        return fullText;
      }

      try {
        const json = JSON.parse(data);
        const delta = json?.choices?.[0]?.delta?.content || "";
        if (delta) {
          fullText += delta;
          onDelta(fullText);
        }
      } catch {}
    }
  }

  return fullText;
}

function buildSystemPrompt(profile) {
  const major = profile?.targetMajor || "Undeclared";
  const dreamSchool = profile?.dreamSchool || "Not specified";
  const countries =
    (profile?.targetCountries || []).join(", ") || "Not specified";
  const gpa = profile?.gpa || "Not provided";
  const grade = profile?.currentGrade || "Not provided";

  return `
You are Gnosis AI Essay Coach, an application assistant for students.

Primary tasks:
- personal statements
- supplemental essays
- interview preparation
- CV / resume writing
- school selection strategy
- scholarship essay ideas
- study planning
- comparing universities and deadlines

Style rules:
- be supportive, practical, and concise
- give concrete suggestions
- tailor advice to the student's profile
- do not make up fake admission guarantees
- strongly prefer markdown tables when comparing schools, organizing plans, listing deadlines, or summarizing revision advice
- when a table is useful, use it automatically
- when a table is not suitable, use bullet points
- output clean markdown with proper line breaks
- when using tables, make valid markdown tables

Student profile:
- Grade: ${grade}
- GPA: ${gpa}
- Target major: ${major}
- Dream school: ${dreamSchool}
- Target countries: ${countries}
`;
}

function smartLocalReply(messages, profile) {
  const lastUserMessage =
    [...messages]
      .reverse()
      .find((m) => m.role === "user")
      ?.content?.trim() || "";

  const major = profile?.targetMajor || "your intended field";
  const dreamSchool = profile?.dreamSchool || "your target universities";

  if (
    /compare|comparison|表格|整理|比較|schools|universities|大學/i.test(
      lastUserMessage,
    )
  ) {
    return [
      `| Option | Fit | Notes |`,
      `|---|---|---|`,
      `| ${dreamSchool} | Reach/Target | Strong choice if essays and profile are competitive |`,
      `| Other schools | Match/Safe | Useful for a balanced application list |`,
    ].join("\n");
  }

  if (/review|edit|improve|修改|潤稿/i.test(lastUserMessage)) {
    return [
      `| Revision Area | What to Improve |`,
      `|---|---|`,
      `| Opening | Start with one vivid moment |`,
      `| Body | Add specific actions and evidence |`,
      `| Ending | Link reflection to ${major} |`,
    ].join("\n");
  }

  return `I can help with essays, interviews, university comparisons, and application planning. I can also use tables when helpful.`;
}
