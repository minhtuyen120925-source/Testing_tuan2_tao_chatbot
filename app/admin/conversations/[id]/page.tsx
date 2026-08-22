import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ExtractLeadButton } from "@/components/admin/extract-lead-button";
import { Card } from "@/components/ui/card";
import { LeadQualityBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function LeadField({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value || <span className="text-muted-foreground">—</span>}</dd>
    </div>
  );
}

export default async function AdminConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabaseAdmin = getSupabaseAdmin();

  const { data: conversation, error } = await supabaseAdmin
    .from("conversations")
    .select("id, channel, started_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Không tải được dữ liệu từ Supabase: ${error.message}`);
  }
  if (!conversation) notFound();

  const { data: messages } = await supabaseAdmin
    .from("messages")
    .select("id, sender, content, created_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  const { data: lead } = await supabaseAdmin
    .from("leads")
    .select(
      "full_name, email, phone, destination_country, study_level, major, scholarship, availability, has_booked_consultation, notes, lead_quality, extracted_at",
    )
    .eq("conversation_id", id)
    .maybeSingle();

  return (
    <>
      <AdminPageHeader
        title={`Hội thoại · ${conversation.channel}`}
        description={`Bắt đầu lúc ${formatDateTime(conversation.started_at)}`}
        action={
          <Link
            href="/admin/conversations"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Quay lại danh sách
          </Link>
        }
      />

      <Card className="mb-6 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-medium">Thông tin lead</h2>
              {lead && <LeadQualityBadge quality={lead.lead_quality} />}
            </div>
            {lead && (
              <p className="mt-1 text-xs text-muted-foreground">
                Trích xuất lúc {formatDateTime(lead.extracted_at)}
              </p>
            )}
          </div>
          <ExtractLeadButton conversationId={id} hasLead={!!lead} />
        </div>

        {lead ? (
          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            <LeadField label="Họ tên" value={lead.full_name} />
            <LeadField label="Email" value={lead.email} />
            <LeadField label="Số điện thoại" value={lead.phone} />
            <LeadField label="Quốc gia du học" value={lead.destination_country} />
            <LeadField label="Bậc học" value={lead.study_level} />
            <LeadField label="Ngành học" value={lead.major} />
            <LeadField label="Học bổng" value={lead.scholarship} />
            <LeadField label="Availability" value={lead.availability} />
            <LeadField
              label="Đã đặt lịch tư vấn"
              value={lead.has_booked_consultation ? "Có" : "Chưa"}
            />
            <div className="sm:col-span-2">
              <LeadField label="Ghi chú" value={lead.notes} />
            </div>
          </dl>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Chưa có dữ liệu lead. Nhấn &quot;Trích xuất thông tin lead&quot; để dùng Gemini phân
            tích hội thoại này.
          </p>
        )}
      </Card>

      <Card className="space-y-3 p-4">
        {(messages ?? []).map((m) => (
          <div
            key={m.id}
            className={cn("flex", m.sender === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[75%] space-y-1",
                m.sender === "user" ? "text-right" : "text-left",
              )}
            >
              <div
                className={cn(
                  "inline-block rounded-2xl px-3.5 py-2 text-sm",
                  m.sender === "user"
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-muted text-foreground",
                )}
              >
                {m.content}
              </div>
              <p className="text-xs text-muted-foreground">{formatDateTime(m.created_at)}</p>
            </div>
          </div>
        ))}
        {(messages ?? []).length === 0 && (
          <p className="py-8 text-center text-muted-foreground">
            Cuộc hội thoại này chưa có tin nhắn nào.
          </p>
        )}
      </Card>
    </>
  );
}
