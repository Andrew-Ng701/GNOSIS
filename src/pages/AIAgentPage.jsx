import { Bot, RotateCcw, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PageHeader from "../components/PageHeader";
import { initialMessages } from "../data/mockData";
import { uid } from "../lib/helpers";
import { streamEssayCoachReply } from "../lib/openai";
import { getMessages, getProfile, saveMessages } from "../lib/storage";

export default function AIAgentPage() {
  const profile = getProfile();
  const [messages, setMessages] = useState(getMessages());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setError("");

    const userMessage = {
      id: uid("msg"),
      role: "user",
      content: text,
    };

    const assistantId = uid("msg");
    const nextMessages = [...messages, userMessage];

    setMessages([
      ...nextMessages,
      {
        id: assistantId,
        role: "assistant",
        content: "",
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      await streamEssayCoachReply(nextMessages, profile, (_, fullText) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: fullText } : msg,
          ),
        );
      });
    } catch (err) {
      setError(err?.message || "Could not reach OpenRouter.");

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content:
                  "OpenRouter connection failed. Please verify API key, model, and network settings.",
              }
            : msg,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  function resetConversation() {
    setMessages(initialMessages);
    saveMessages(initialMessages);
    setError("");
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      <PageHeader
        title="AI Essay Coach"
        subtitle="Brainstorm, revise, and practice with AI guidance"
        right={
          <button className="icon-btn" onClick={resetConversation}>
            <RotateCcw size={18} />
          </button>
        }
      />

      <div className="card flex h-[68vh] flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" ? (
                <div className="max-w-[90%] rounded-3xl rounded-tl-md bg-slate-50 px-4 py-3 text-sm text-ink">
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-brand-600">
                    <Bot size={14} />
                    Gnosis AI
                  </div>
                  <MessageContent
                    content={message.content}
                    streaming={loading && !message.content}
                  />
                </div>
              ) : (
                <div className="max-w-[85%] rounded-3xl rounded-tr-md bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-3 text-sm text-white">
                  <p className="whitespace-pre-wrap leading-6">
                    {message.content}
                  </p>
                </div>
              )}
            </div>
          ))}

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div ref={bottomRef} />
        </div>

        <div className="border-t border-slate-100 bg-white p-3">
          <div className="flex items-end gap-2">
            <textarea
              className="input min-h-[52px] resize-none"
              rows={1}
              placeholder="Ask me anything about your application..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <button
              className="primary-btn !px-4"
              onClick={sendMessage}
              disabled={loading}
            >
              <SendHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function MessageContent({ content, streaming }) {
  if (!content && streaming) {
    return (
      <div className="flex items-center gap-2 text-sm text-body">
        <span className="inline-flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400" />
        </span>
        Thinking...
      </div>
    );
  }

  const blocks = parseStructuredContent(content || "");

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h3 key={index} className="text-base font-semibold text-ink">
              {block.text}
            </h3>
          );
        }

        if (block.type === "ordered") {
          return (
            <ol key={index} className="space-y-2">
              {block.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="flex gap-3 rounded-2xl bg-white px-3 py-3"
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                    {itemIndex + 1}
                  </span>
                  <span className="min-w-0 leading-6 text-slate-700">
                    {renderInline(item)}
                  </span>
                </li>
              ))}
            </ol>
          );
        }

        if (block.type === "unordered") {
          return (
            <ul key={index} className="space-y-2">
              {block.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="flex gap-3 rounded-2xl bg-white px-3 py-3"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                  <span className="min-w-0 leading-6 text-slate-700">
                    {renderInline(item)}
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <div
            key={index}
            className="rounded-2xl bg-white px-4 py-3 leading-7 text-slate-700"
          >
            {renderInline(block.text)}
          </div>
        );
      })}
    </div>
  );
}

function parseStructuredContent(text) {
  const lines = text.split("\n");
  const blocks = [];
  let paragraph = [];
  let ordered = [];
  let unordered = [];

  function flushParagraph() {
    if (paragraph.length) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ").trim() });
      paragraph = [];
    }
  }

  function flushOrdered() {
    if (ordered.length) {
      blocks.push({ type: "ordered", items: [...ordered] });
      ordered = [];
    }
  }

  function flushUnordered() {
    if (unordered.length) {
      blocks.push({ type: "unordered", items: [...unordered] });
      unordered = [];
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushOrdered();
      flushUnordered();
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushOrdered();
      flushUnordered();
      blocks.push({ type: "heading", text: line.replace(/^###\s+/, "") });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      flushUnordered();
      ordered.push(line.replace(/^\d+\.\s+/, ""));
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      flushOrdered();
      unordered.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }

    flushOrdered();
    flushUnordered();
    paragraph.push(line);
  }

  flushParagraph();
  flushOrdered();
  flushUnordered();

  return blocks;
}

function renderInline(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}
