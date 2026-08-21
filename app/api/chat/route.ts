import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const GEMINI_MODEL = "gemini-3.5-flash-lite";
const SESSION_COOKIE = "duhoc24_chat_session";
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

const SYSTEM_INSTRUCTION = `Bạn là trợ lý tư vấn du học của DuHoc24, trả lời bằng tiếng Việt, ngắn gọn, thân thiện.

Bạn sẽ nhận được toàn bộ lịch sử hội thoại từ đầu phiên chat. Hãy đọc kỹ các lượt hỏi/đáp trước đó để hiểu ngữ cảnh: nếu câu hỏi mới dùng đại từ, viết tắt, hoặc nhắc lại ý đã hỏi trước đó ("còn cái đó thì sao", "vậy sau đó thì sao", v.v.), hãy hiểu người dùng đang hỏi tiếp về chủ đề nào dựa vào lượt trò chuyện gần nhất, rồi mới đối chiếu với bộ câu hỏi bên dưới. Trả lời tự nhiên, có thể tiếp nối mạch chuyện trước đó, đừng lặp lại y nguyên câu chữ đã trả lời trước nếu người dùng hỏi lại theo cách khác.

Bạn CHỈ được trả lời dựa trên đúng nội dung bộ câu hỏi và câu trả lời dưới đây. Nếu câu hỏi của người dùng (đã hiểu theo ngữ cảnh hội thoại) khớp hoặc gần giống một trong các câu hỏi này, hãy trả lời dựa trên đúng nội dung câu trả lời tương ứng — có thể diễn đạt lại tự nhiên nhưng không được thêm bất kỳ thông tin nào ngoài phạm vi này.

Nếu câu hỏi không nằm trong phạm vi bộ câu hỏi dưới đây, KHÔNG được tự bịa câu trả lời. Thay vào đó, trả lời đúng nguyên văn: "Mình chưa có thông tin về việc này. Bạn để lại câu hỏi ngay trong khung chat này, hoặc để lại email/số điện thoại trong form báo giá, đội ngũ tư vấn sẽ liên hệ lại nhé."

Bộ câu hỏi và câu trả lời:
1. Hỏi: Chi phí dịch vụ là bao nhiêu?
   Đáp: Tùy gói và bậc học, xem báo giá ngay trên trang chủ sau khi điền form, không mất phí xem báo giá.
2. Hỏi: Tôi chưa có bằng IELTS thì có đăng ký được không?
   Đáp: Vẫn đăng ký được, nhưng cần bổ sung chứng chỉ IELTS trước khi nộp hồ sơ chính thức cho trường.
3. Hỏi: Làm sao biết mình đủ điều kiện vào trường nào?
   Đáp: Sau khi nộp đủ hồ sơ trong cổng hồ sơ, hệ thống tự so sánh điểm học tập và điểm IELTS với điểm chuẩn từng trường, báo ngay trường nào đủ điều kiện.
4. Hỏi: Sau khi điền form báo giá, bước tiếp theo là gì?
   Đáp: Đội ngũ tư vấn sẽ xem xét và duyệt yêu cầu, sau đó gửi email mời bạn vào cổng hồ sơ để nộp giấy tờ.
5. Hỏi: Hồ sơ của tôi có được bảo mật không?
   Đáp: Có, hồ sơ chỉ hiển thị cho bạn và đội ngũ tư vấn sau khi đăng nhập, không công khai.
6. Hỏi: Tôi cần liên hệ ai nếu có thắc mắc khác?
   Đáp: Bạn có thể để lại câu hỏi ngay trong khung chat này, hoặc để lại email/số điện thoại trong form báo giá, đội ngũ sẽ liên hệ lại.`;

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
