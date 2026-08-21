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
  "Dịch vụ này gồm những gì?",
  "Bao lâu thì có kết quả xét duyệt?",
  "Chi phí dịch vụ là bao nhiêu?",
  "Tôi cần chuẩn bị giấy tờ gì?",
];

const cannedAnswers: Record<string, string> = {
  "Dịch vụ này gồm những gì?":
    "Bên mình lo phần đối chiếu điểm chuẩn, kiểm tra hồ sơ và tư vấn chọn trường, chia làm 2 gói: Cơ bản và Toàn diện.",
  "Bao lâu thì có kết quả xét duyệt?":
    "Nộp đủ giấy tờ là có kết quả đối chiếu điểm chuẩn ngay. Sau đó tư vấn viên sẽ gọi xác nhận lại với bạn trong vòng 24h.",
  "Chi phí dịch vụ là bao nhiêu?":
    "Gói Cơ bản 18.000.000₫, gói Toàn diện 45.000.000₫ nhé. Bạn kéo lên phần báo giá phía trên để xem chi tiết quyền lợi từng gói.",
  "Tôi cần chuẩn bị giấy tờ gì?":
    "3 thứ thôi: bảng điểm (PDF), ảnh chứng chỉ IELTS, và ảnh CMND/CCCD hoặc hộ chiếu.",
};

const initialMessages: Message[] = [
  { from: "bot", text: "Chào bạn! Mình là trợ lý ảo của DuHoc24, bạn cần hỗ trợ gì về hồ sơ du học?" },
];

export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [input, setInput] = React.useState("");

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const answer = cannedAnswers[text];
    setMessages((prev) => [
      ...prev,
      { from: "user", text },
      ...(answer ? [{ from: "bot" as const, text: answer }] : []),
    ]);
    setInput("");
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
          </div>

          <div className="border-t p-3">
            <div className="flex flex-wrap gap-1.5 pb-2">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground duration-150 hover:border-primary hover:text-primary"
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
                className="h-9 flex-1 rounded-full border border-input bg-transparent px-3.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <Button type="submit" size="icon" className="shrink-0" aria-label="Gửi">
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
