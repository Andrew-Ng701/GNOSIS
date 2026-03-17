import { Bot, RotateCcw, SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PageHeader from "../components/PageHeader";
import { getMessages, getProfile, saveMessages } from "../lib/storage";
import { streamEssayCoachReply } from "../lib/openai";
import { uid } from "../lib/helpers";
import { initialMessages } from "../data/mockData";

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

    const nextMessages = [
      ...messages,
      userMessage,
      {
        id: assistantId,
        role: "assistant",
        content: "",
      },
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      await streamEssayCoachReply(
        [...messages, userMessage],
        profile,
        (partialText) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId ? { ...msg, content: partialText } : msg,
            ),
          );
        },
      );
    } catch (err) {
      setError(
        err?.message ||
          "Could not reach OpenRouter. Check API key, model, or CORS settings.",
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content:
                  "I’m having trouble connecting to the live AI service right now. Please check your OpenRouter configuration.",
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
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" ? (
                <div className="max-w-[86%] rounded-3xl rounded-tl-md bg-slate-100 px-4 py-3 text-sm text-ink">
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-brand-600">
                    <Bot size={14} />
                    Gnosis AI
                  </div>

                  <div className="prose prose-sm max-w-none prose-table:block prose-table:overflow-x-auto">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content || (loading ? "..." : "")}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="max-w-[86%] rounded-3xl rounded-tr-md bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-3 text-sm text-white">
                  <p className="whitespace-pre-wrap leading-6">
                    {message.content}
                  </p>
                </div>
              )}
            </div>
          ))}

          {error ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
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
              className={`primary-btn !px-4 ${loading || !input.trim() ? "opacity-60" : ""}`}
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
