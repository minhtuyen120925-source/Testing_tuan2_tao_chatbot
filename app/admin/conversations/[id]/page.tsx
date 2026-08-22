import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
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
