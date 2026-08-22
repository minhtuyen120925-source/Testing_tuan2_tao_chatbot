import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const GEMINI_MODEL = "gemini-3.5-flash-lite";
const SESSION_COOKIE = "duhoc24_chat_session";
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

const SYSTEM_INSTRUCTION = `## Persona
Bạn là Trợ lý AI Tư vấn Du học — một trợ lý ảo thân thiện, nhiệt tình, hỗ trợ học sinh/phụ huynh tìm hiểu về du học.

## Core Task/Objective
💬 Nhiệm vụ của bạn là dẫn dắt cuộc trò chuyện có cấu trúc để hiểu nhu cầu du học của người dùng, thu thập thông tin liên hệ và giới thiệu dịch vụ tư vấn phù hợp. Trả lời ngắn gọn, hữu ích.
💬 Trả lời bằng đúng ngôn ngữ người dùng đang sử dụng.
💬 Mỗi lượt chỉ hỏi một câu hỏi.

## Constraints/Rules
⚠️ QUY TẮC KHÁC:
- Không đề cập chi phí/học phí trừ khi người dùng chủ động hỏi
- Không tự đưa ra cam kết về tỷ lệ đậu visa hoặc học bổng

## Additional Information
🧠 LUỒNG HỘI THOẠI:
1. Hỏi người dùng đang quan tâm du học nước nào (hoặc đang phân vân giữa các nước)
2. Hỏi về mục tiêu/bậc học (THPT, Đại học, Thạc sĩ...) và ngành học quan tâm
3. Dựa trên nhu cầu, giới thiệu dịch vụ tư vấn phù hợp (chọn trường, hồ sơ, xin visa, học bổng...)
4. Hỏi họ có muốn tìm hiểu thêm chi tiết không
5. Nếu có, thu thập lần lượt: họ tên → email → số điện thoại
6. Sau đó, cung cấp thông tin chi tiết hơn về quy trình tư vấn và mời đặt lịch tư vấn miễn phí
7. Hỏi họ có ghi chú/câu hỏi nào khác trước khi kết thúc

## Dịch vụ
Tư vấn chọn trường & ngành học, hỗ trợ hồ sơ apply, tư vấn xin visa, tìm học bổng, đào tạo kỹ năng trước khi du học (ngôn ngữ, phỏng vấn).
Trụ sở: Số 1 Hai Bà Trưng, Hà Nội
Liên hệ: 0912 345 6789

## Configuration
- Mục tiêu: Thu thập lead và đặt lịch tư vấn
- Phong cách trả lời: Cân bằng, đi thẳng vào trọng tâm, tối đa 2-3 câu mỗi lượt trừ khi cần chi tiết hơn`;

interface StoredMessage {
  sender: "user" | "bot";
  content: string;
  created_at: string;
}

async function getOrCreateConversation(supabaseAdmin: ReturnType<typeof getSupabaseAdmin>) {
  const cookieStore = await cookies();
  const existingSessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (existingSessionId) {
    const { data } = await supabaseAdmin
      .from("conversations")
      .select("id")
      .eq("session_id", existingSessionId)
      .maybeSingle();
    if (data) return { conversationId: data.id as string, isNew: false };
  }

  const sessionId = randomUUID();
  const { data, error } = await supabaseAdmin
    .from("conversations")
    .insert({ session_id: sessionId, channel: "Web" })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Không tạo được cuộc hội thoại.");

  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_COOKIE_MAX_AGE,
    path: "/",
  });

  return { conversationId: data.id as string, isNew: true };
}

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return NextResponse.json({ messages: [] });

  const supabaseAdmin = getSupabaseAdmin();
  const { data: conversation } = await supabaseAdmin
    .from("conversations")
    .select("id")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (!conversation) return NextResponse.json({ messages: [] });

  const { data: rows } = await supabaseAdmin
    .from("messages")
    .select("sender, content, created_at")
    .eq("conversation_id", conversation.id)
    .order("created_at", { ascending: true });

  const messages = ((rows ?? []) as StoredMessage[]).map((m) => ({
    from: m.sender,
    text: m.content,
  }));

  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const message: string | undefined = body?.message;

  if (!message || !message.trim()) {
    return NextResponse.json({ error: "Thiếu nội dung câu hỏi." }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  let conversationId: string;
  try {
    ({ conversationId } = await getOrCreateConversation(supabaseAdmin));
  } catch (err) {
    console.error("Supabase conversation error:", err);
    return NextResponse.json(
      { error: "Không lưu được hội thoại, bạn thử lại sau nhé." },
      { status: 500 },
    );
  }

  const { data: historyRows } = await supabaseAdmin
    .from("messages")
    .select("sender, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  // Save the customer's message immediately, even if the Gemini call below fails.
  const { error: insertUserError } = await supabaseAdmin
    .from("messages")
    .insert({ conversation_id: conversationId, sender: "user", content: message });

  if (insertUserError) {
    console.error("Supabase insert (user) error:", insertUserError);
    return NextResponse.json(
      { error: "Không lưu được tin nhắn, bạn thử lại sau nhé." },
      { status: 500 },
    );
  }

  const contents = [
    ...((historyRows ?? []) as Pick<StoredMessage, "sender" | "content">[]).map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server chưa cấu hình GEMINI_API_KEY." },
      { status: 500 },
    );
  }

  let response: Response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents,
          generationConfig: { temperature: 0.2, maxOutputTokens: 300 },
        }),
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Không kết nối được tới Gemini, bạn thử lại sau nhé." },
      { status: 502 },
    );
  }

  if (!response.ok) {
    const errText = await response.text();
    console.error("Gemini API error:", response.status, errText);
    return NextResponse.json(
      { error: "Không thể lấy câu trả lời lúc này, bạn thử lại sau nhé." },
      { status: 502 },
    );
  }

  const data = await response.json();
  const reply: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!reply) {
    return NextResponse.json(
      { error: "Không thể lấy câu trả lời lúc này, bạn thử lại sau nhé." },
      { status: 502 },
    );
  }

  const trimmedReply = reply.trim();

  const { error: insertBotError } = await supabaseAdmin
    .from("messages")
    .insert({ conversation_id: conversationId, sender: "bot", content: trimmedReply });

  if (insertBotError) {
    console.error("Supabase insert (bot) error:", insertBotError);
  }

  return NextResponse.json({ reply: trimmedReply });
}
