import { cn } from "@/lib/utils";
import type { DocStatus, RequestStatus } from "@/lib/mock-data";
import { CheckCircle2, CircleDashed, Loader2, TriangleAlert } from "lucide-react";

type Tone = "gray" | "yellow" | "green" | "red";

const toneClasses: Record<Tone, string> = {
  gray: "bg-gray-100 text-gray-600 ring-gray-200",
  yellow: "bg-yellow-100 text-yellow-700 ring-yellow-200",
  green: "bg-green-100 text-green-700 ring-green-200",
  red: "bg-red-100 text-red-700 ring-red-200",
};

const dotToneClasses: Record<Tone, string> = {
  gray: "bg-gray-400",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
  red: "bg-red-500",
};

export function StatusBadge({
  tone,
  label,
  icon,
  className,
}: {
  tone: Tone;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        toneClasses[tone],
        className,
      )}
    >
      {icon}
      {label}
    </span>
  );
}

export function StatusDot({ tone, className }: { tone: Tone; className?: string }) {
  return <span className={cn("inline-block size-2.5 rounded-full", dotToneClasses[tone], className)} />;
}

export const docStatusMeta: Record<
  DocStatus,
  { label: string; tone: Tone; icon: React.ReactNode }
> = {
  chua_nop: { label: "Chưa nộp", tone: "gray", icon: <CircleDashed className="size-3.5" /> },
  dang_xu_ly: { label: "Đang xử lý", tone: "yellow", icon: <Loader2 className="size-3.5 animate-spin" /> },
  hop_le: { label: "Hợp lệ", tone: "green", icon: <CheckCircle2 className="size-3.5" /> },
  can_nop_lai: { label: "Cần nộp lại", tone: "red", icon: <TriangleAlert className="size-3.5" /> },
};

export const requestStatusMeta: Record<RequestStatus, { label: string; tone: Tone }> = {
  cho_duyet: { label: "Chờ duyệt", tone: "yellow" },
  da_duyet: { label: "Đã duyệt", tone: "green" },
  tu_choi: { label: "Từ chối", tone: "gray" },
};

export function DocStatusBadge({ status, className }: { status: DocStatus; className?: string }) {
  const meta = docStatusMeta[status];
  return (
    <StatusBadge
      tone={meta.tone}
      label={meta.label}
      icon={meta.icon}
      className={className}
    />
  );
}

export function RequestStatusBadge({ status, className }: { status: RequestStatus; className?: string }) {
  const meta = requestStatusMeta[status];
  return (
    <StatusBadge
      tone={meta.tone}
      label={meta.label}
      className={className}
    />
  );
}
