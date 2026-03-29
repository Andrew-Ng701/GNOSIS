const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY =
  "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";
const OPENROUTER_MODEL = "stepfun/step-3.5-flash:free";
const SITE_URL =
  import.meta.env.VITE_SITE_URL ||
  window.location.origin ||
  "http://localhost:5173";
const SITE_NAME = import.meta.env.VITE_SITE_NAME || "Gnosis";

export function canUseRealAI() {
  return Boolean(
    OPENROUTER_API_KEY && OPENROUTER_API_KEY !== "YOUR_OPENROUTER_API_KEY_HERE",
  );
}

function buildSystemPrompt(profile) {
  return [
    "You are Gnosis AI Essay Coach.",
    "You help with university applications, essays, school fit analysis, interview prep, and strategy.",
    "Always write in clean, well-structured markdown.",
    "Use short sections, short bullets, and avoid giant unbroken blocks.",
    "When giving school-fit analysis, prefer this structure:",
    "1. Quick read",
    "2. What it means for the student's major",
    "3. Admissions fit",
    "4. What to do next",
    profile?.targetMajor ? `Target major: ${profile.targetMajor}.` : "",
    profile?.dreamSchool ? `Dream school: ${profile.dreamSchool}.` : "",
    profile?.targetCountries?.length
      ? `Target countries: ${profile.targetCountries.join(", ")}.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function buildPayload(messages, profile, stream = false) {
  return {
    model: OPENROUTER_MODEL,
    stream,
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: buildSystemPrompt(profile),
      },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ],
  };
}

function getHeaders() {
  return {
    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": SITE_URL,
    "X-Title": SITE_NAME,
  };
}

function ensureApiKey() {
  if (!canUseRealAI()) {
    throw new Error(
      "Missing OpenRouter API key. Replace YOUR_OPENROUTER_API_KEY_HERE in src/lib/openai.js.",
    );
  }
}

function cleanJsonText(text) {
  return (text || "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function getMessageContent(data) {
  return data?.choices?.[0]?.message?.content?.trim() || "";
}

function normalizeQuestion(question, index) {
  const options = Array.isArray(question?.options)
    ? question.options.slice(0, 4)
    : [];

  return {
    id: Number(question?.id) || index + 1,
    question: String(question?.question || `Question ${index + 1}`),
    options:
      options.length === 4
        ? options.map((item) => String(item))
        : ["Option A", "Option B", "Option C", "Option D"],
    answer:
      typeof question?.answer === "number" &&
      question.answer >= 0 &&
      question.answer <= 3
        ? question.answer
        : 0,
    explanation: String(
      question?.explanation || "Review the IELTS concept behind this item.",
    ),
  };
}

export async function getEssayCoachReply(messages, profile) {
  ensureApiKey();

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(buildPayload(messages, profile, false)),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "OpenRouter request failed");
  }

  const data = await response.json();
  const reply = getMessageContent(data);

  if (!reply) {
    throw new Error("OpenRouter returned empty content");
  }

  return reply;
}

export async function streamEssayCoachReply(messages, profile, onDelta) {
  ensureApiKey();

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(buildPayload(messages, profile, true)),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "OpenRouter streaming request failed");
  }

  if (!response.body) {
    throw new Error("Streaming response body is unavailable");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let fullText = "";
  let buffered = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffered += decoder.decode(value, { stream: true });

    const parts = buffered.split("\n");
    buffered = parts.pop() || "";

    for (const line of parts) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;

      const payload = trimmed.replace(/^data:\s*/, "").trim();

      if (payload === "[DONE]") {
        return fullText;
      }

      try {
        const json = JSON.parse(payload);
        const chunkText = json?.choices?.[0]?.delta?.content || "";

        if (chunkText) {
          fullText += chunkText;
          onDelta?.(chunkText, fullText);
        }
      } catch {
        continue;
      }
    }
  }

  return fullText;
}

export async function generateIeltsQuiz(profile) {
  ensureApiKey();

  const system = [
    "You are an IELTS preparation assistant.",
    "Create exactly 20 IELTS multiple-choice questions.",
    "All questions must be returned as JSON only.",
    "Focus on IELTS exam format, candidate understanding of the test, and concepts that improve performance.",
    "Each question must have 4 options.",
    "Each question must include: id, question, options, answer, explanation.",
    "The answer must be the zero-based index of the correct option.",
    "Do not include markdown fences.",
    'Return valid JSON in this shape: {"questions":[...]}',
  ].join(" ");

  const user = [
    "Student profile:",
    `Name: ${profile?.fullName || "Student"}`,
    `Grade: ${profile?.currentGrade || "Unknown"}`,
    `Country: ${profile?.country || "Unknown"}`,
    `City: ${profile?.city || "Unknown"}`,
    "Target score context: IELTS practice",
    "Need 20 questions, MC only, varied questions each time, some overlap acceptable.",
  ].join("\n");

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      temperature: 0.9,
      stream: false,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "OpenRouter request failed");
  }

  const data = await response.json();
  const content = getMessageContent(data);

  if (!content) {
    throw new Error("OpenRouter returned empty content");
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = JSON.parse(cleanJsonText(content));
  }

  if (!parsed?.questions || !Array.isArray(parsed.questions)) {
    throw new Error("Invalid IELTS quiz format");
  }

  return parsed.questions.slice(0, 20).map(normalizeQuestion);
}

export {
  OPENROUTER_API_URL,
  OPENROUTER_API_KEY,
  OPENROUTER_MODEL,
  SITE_URL,
  SITE_NAME,
};
