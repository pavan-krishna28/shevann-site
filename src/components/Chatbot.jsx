import { useState, useRef, useEffect } from "react";
import { useContent } from "../context/ContentContext.jsx";

// Simple Levenshtein-based fuzzy match so close typos still hit a keyword.
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function findAnswer(message, knowledge, fallback) {
  const text = message.toLowerCase();
  const words = text.split(/\W+/).filter(Boolean);

  let best = null;
  let bestScore = 0;

  for (const entry of knowledge) {
    for (const kw of entry.keywords) {
      const kwLower = kw.toLowerCase();
      if (text.includes(kwLower)) {
        // direct substring match = strong signal
        const score = kwLower.length;
        if (score > bestScore) {
          bestScore = score;
          best = entry;
        }
        continue;
      }
      // fuzzy match against individual words for typo tolerance
      for (const w of words) {
        if (w.length < 3) continue;
        const dist = levenshtein(w, kwLower);
        if (dist <= 1 && kwLower.length > 3) {
          const score = kwLower.length - dist;
          if (score > bestScore) {
            bestScore = score;
            best = entry;
          }
        }
      }
    }
  }

  return best ? best.answer : fallback;
}

export default function Chatbot() {
  const { content } = useContent();
  const { chatbot } = content;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", text: chatbot.greeting }]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function handleSend(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    const answer = findAnswer(trimmed, chatbot.knowledge, chatbot.fallback);
    setMessages((prev) => [...prev, { role: "user", text: trimmed }, { role: "bot", text: answer }]);
    setInput("");
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="glass mb-3 flex h-96 w-80 flex-col rounded-2xl border border-ink/10 shadow-2xl">
          <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
            <p className="font-display text-sm">Shevann Assistant</p>
            <button aria-label="Close chat" onClick={() => setOpen(false)} className="text-ink/60 hover:text-coral">
              ✕
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  m.role === "bot"
                    ? "bg-navy-soft text-ink/90"
                    : "ml-auto bg-coral-gradient text-navy"
                }`}
              >
                {m.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <form onSubmit={handleSend} className="flex gap-2 border-t border-ink/10 p-3">
            <label htmlFor="chat-input" className="sr-only">
              Type a message
            </label>
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="flex-1 rounded-full bg-navy-soft px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-coral-gradient px-4 py-2 text-sm font-semibold text-navy"
            >
              Send
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chatbot" : "Open chatbot"}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-coral-gradient text-navy shadow-lg shadow-coral/30 transition-transform hover:scale-110"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
