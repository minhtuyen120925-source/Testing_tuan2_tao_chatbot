import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default async function AdminConversationsPage() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data: conversations, error } = await supabaseAdmin
    .from("conversations")
    .select("id, channel, started_at, messages(content, sender, created_at)")
    .order("started_at", { ascending: false })
    .order("created_at", { referencedTable: "messages", ascending: true });

  return (
    <>
      <AdminPageHeader
        title="Hội thoại"
        description="Lịch sử hội thoại của khách với chatbot hỏi đáp trên trang chủ."
      />

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Không tải được dữ liệu từ Supabase: {error.message}
        </div>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kênh</TableHead>
              <TableHead>Số tin nhắn</TableHead>
              <TableHead>Tin nhắn gần nhất</TableHead>
              <TableHead>Thời gian bắt đầu</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(conversations ?? []).map((conv) => {
              const lastMessage = conv.messages[conv.messages.length - 1];
              return (
                <TableRow key={conv.id}>
                  <TableCell className="font-medium">{conv.channel}</TableCell>
                  <TableCell>{conv.messages.length} tin nhắn</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {lastMessage?.content ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(conv.started_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" nativeButton={false} render={
                      <Link href={`/admin/conversations/${conv.id}`}>Xem</Link>
                    } />
                  </TableCell>
                </TableRow>
              );
            })}
            {(conversations ?? []).length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Chưa có cuộc hội thoại nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
