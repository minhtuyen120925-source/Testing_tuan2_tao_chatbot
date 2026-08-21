"use client";

import React from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  from: "bot" | "user";
  text: string;
}

const quickQuestions = [
  "Chi phí dịch vụ là bao nhiêu?",
  "Tôi chưa có bằng IELTS thì có đăng ký được không?",
  "Làm sao biết mình đủ điều kiện vào trường nào?",
  "Hồ sơ của tôi có được bảo mật không?",
];

const greeting: Message = {
  from: "bot",
  text: "Chào bạn! Mình là trợ lý ảo của DuHoc24, bạn cần hỗ trợ gì về hồ sơ du học?",
};

export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([greeting]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const historyLoadedRef = React.useRef(false);

  React.useEffect(() => {
    if (!open || historyLoadedRef.current) return;
    historyLoadedRef.current = true;
    fetch("/api/chat")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(data.messages);
        }
      })
      .catch(() => {});
  }, [open]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const reply: string =
        data.reply ?? data.error ?? "Có lỗi xảy ra, bạn thử lại sau nhé.";
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Có lỗi xảy ra, bạn thử lại sau nhé." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex h-[28rem] w-80 flex-col overflow-hidden rounded-2xl border bg-card shadow-xl shadow-black/10 ring-1 ring-foreground/6.5 sm:w-96">
          <div className="flex items-center justify-between border-b bg-primary px-4 py-3 text-primary-foreground">
            <div>
              <p className="text-sm font-medium">Hỏi đáp nhanh</p>
              <p className="text-xs opacity-80">Thường trả lời trong vài phút</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Đóng khung chat"
              className="flex size-7 items-center justify-center rounded-full hover:bg-white/10"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm",
                    m.from === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted text-foreground",
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2 text-sm text-muted-foreground">
                  Đang trả lời...
                </div>
              </div>
            )}
          </div>

          <div className="border-t p-3">
            <div className="flex flex-wrap gap-1.5 pb-2">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                  className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground duration-150 hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập câu hỏi của bạn..."
                disabled={loading}
                className="h-9 flex-1 rounded-full border border-input bg-transparent px-3.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
              />
              <Button
                type="submit"
                size="icon"
                className="shrink-0"
                aria-label="Gửi"
                disabled={loading}
              >
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Đóng khung chat" : "Mở khung chat hỏi đáp"}
        className="ml-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-black/20 duration-150 hover:brightness-105 active:scale-95"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </div>
  );
}
