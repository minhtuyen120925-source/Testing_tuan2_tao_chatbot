import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { School } from "@/lib/mock-data";

export function SchoolMatch({ matches }: { matches: { school: School; passed: boolean }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Đối chiếu điểm chuẩn</CardTitle>
        <p className="text-sm text-muted-foreground">
          So sánh điểm học tập và IELTS của bạn với điểm chuẩn từng trường.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {matches.map(({ school, passed }) => (
          <div
            key={school.id}
            className={cn(
              "flex items-center justify-between gap-4 rounded-xl border p-4",
              passed ? "border-green-200 bg-green-50" : "border-border bg-muted/30",
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full",
                  passed ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500",
                )}
              >
                {passed ? <Check className="size-4" /> : <X className="size-4" />}
              </span>
              <div>
                <p className="font-medium">{school.name}</p>
                <p className="text-sm text-muted-foreground">{school.country}</p>
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Yêu cầu GPA ≥ {school.minGpa.toFixed(1)}</p>
              <p>IELTS ≥ {school.minIelts.toFixed(1)}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
