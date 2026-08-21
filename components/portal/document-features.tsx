import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DocStatusBadge } from "@/components/status-badge";
import type { DocStatus } from "@/lib/mock-data";

interface DocumentFeature {
  icon: LucideIcon;
  title: string;
  accept: string;
  fileName: string;
  status: DocStatus;
  reason?: string;
}

export function DocumentFeatures({ items }: { items: DocumentFeature[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.title}>
          <Card className="flex aspect-video flex-col items-center justify-center gap-2 border-none bg-foreground/5 p-6 shadow-none ring-0">
            <item.icon className="size-7 text-muted-foreground" />
            <span className="max-w-full truncate px-4 text-xs text-muted-foreground">
              {item.fileName}
            </span>
          </Card>

          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <DocStatusBadge status={item.status} />
            </div>
            <p className="mt-3 text-balance text-muted-foreground">
              {item.status === "can_nop_lai" && item.reason ? (
                <>
                  Cần nộp lại: <span className="text-red-600">{item.reason}</span>
                </>
              ) : (
                item.accept
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
