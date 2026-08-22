import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const GEMINI_MODEL = "gemini-3.5-flash-lite";

const EXTRACTION_SYSTEM_INSTRUCTION = `Bạn là hệ thống trích xuất dữ liệu lead từ một đoạn hội thoại tư vấn du học. Đọc kỹ toàn bộ hội thoại được cung cấp và trả về đúng các trường theo schema, CHỈ dựa trên thông tin khách đã thực sự nói trong hội thoại — không suy đoán, không tự bịa thêm.

Quy tắc:
- Nếu một trường không được nhắc tới trong hội thoại, để giá trị là chuỗi rỗng "".
- has_booked_consultation: true nếu khách đã xác nhận đặt lịch tư vấn trong hội thoại, ngược lại false.
- lead_quality:
  - "good": khách đã cung cấp đủ thông tin liên hệ (họ tên, và email hoặc số điện thoại) và thể hiện nhu cầu du học rõ ràng, nghiêm túc.
  - "ok": khách có trao đổi về nhu cầu du học nhưng chưa cung cấp đủ thông tin liên hệ, hoặc thông tin còn mơ hồ, chưa rõ ràng.
  - "spam": hội thoại không có nội dung liên quan đến du học (chỉ test/vô nghĩa/quấy rối), hoặc thông tin liên hệ rõ ràng là giả/vô lý.
- notes: tóm tắt ngắn gọn (1-2 câu) các điểm đáng chú ý khác về nhu cầu/thái độ của khách, nếu có.`;

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    full_name: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" },
    destination_country: { type: "string" },
    study_level: { type: "string" },
    major: { type: "string" },
    scholarship: { type: "string" },
    availability: { type: "string" },
    has_booked_consultation: { type: "boolean" },
    notes: { type: "string" },
    lead_quality: { type: "string", enum: ["good", "ok", "spam"] },
  },
  required: [
    "full_name",
    "email",
    "phone",
    "destination_country",
    "study_level",
    "major",
    "scholarship",
    "availability",
    "has_booked_consultation",
    "notes",
    "lead_quality",
  ],
};

interface ExtractedLead {
  full_name: string;
  email: string;
  phone: string;
  destination_country: string;
  study_level: string;
  major: string;
  scholarship: string;
  availability: string;
  has_booked_consultation: boolean;
  notes: string;
  lead_quality: "good" | "ok" | "spam";
}

function toNullable(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: conversationId } = await params;
  const supabaseAdmin = getSupabaseAdmin();

  const { data: messages, error: messagesError } = await supabaseAdmin
    .from("messages")
    .select("sender, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (messagesError) {
    return NextResponse.json(
      { error: `Không đọc được tin nhắn: ${messagesError.message}` },
      { status: 500 },
    );
  }

  if (!messages || messages.length === 0) {
    return NextResponse.json(
      { error: "Cuộc hội thoại chưa có tin nhắn nào để trích xuất." },
      { status: 400 },
    );
  }

  const transcript = messages
    .map((m) => `${m.sender === "user" ? "Khách" : "Trợ lý"}: ${m.content}`)
    .join("\n");

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
          systemInstruction: { parts: [{ text: EXTRACTION_SYSTEM_INSTRUCTION }] },
          contents: [
            { role: "user", parts: [{ text: `Đoạn hội thoại:\n\n${transcript}` }] },
          ],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
          },
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
    console.error("Gemini extraction error:", response.status, errText);
    return NextResponse.json(
      { error: "Gemini không trích xuất được dữ liệu, bạn thử lại sau nhé." },
      { status: 502 },
    );
  }

  const data = await response.json();
  const rawText: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    return NextResponse.json(
      { error: "Gemini không trả về dữ liệu, bạn thử lại sau nhé." },
      { status: 502 },
    );
  }

  let extracted: ExtractedLead;
  try {
    extracted = JSON.parse(rawText);
  } catch {
    return NextResponse.json(
      { error: "Không đọc được dữ liệu Gemini trả về." },
      { status: 502 },
    );
  }

  const { data: lead, error: upsertError } = await supabaseAdmin
    .from("leads")
    .upsert(
      {
        conversation_id: conversationId,
        full_name: toNullable(extracted.full_name ?? ""),
        email: toNullable(extracted.email ?? ""),
        phone: toNullable(extracted.phone ?? ""),
        destination_country: toNullable(extracted.destination_country ?? ""),
        study_level: toNullable(extracted.study_level ?? ""),
        major: toNullable(extracted.major ?? ""),
        scholarship: toNullable(extracted.scholarship ?? ""),
        availability: toNullable(extracted.availability ?? ""),
        has_booked_consultation: Boolean(extracted.has_booked_consultation),
        notes: toNullable(extracted.notes ?? ""),
        lead_quality: extracted.lead_quality,
        extracted_at: new Date().toISOString(),
      },
      { onConflict: "conversation_id" },
    )
    .select()
    .single();

  if (upsertError) {
    console.error("Supabase lead upsert error:", upsertError);
    return NextResponse.json(
      { error: `Không lưu được lead: ${upsertError.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ lead });
}
