import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ExtractedInfo({
  fullName,
  dateOfBirth,
  gpa,
  ielts,
}: {
  fullName: string;
  dateOfBirth: string;
  gpa: number;
  ielts: number;
}) {
  const fields = [
    { label: "Họ tên", value: fullName },
    { label: "Ngày sinh", value: dateOfBirth },
    { label: "Điểm học tập (GPA)", value: gpa.toFixed(1) },
    { label: "Điểm IELTS", value: ielts.toFixed(1) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin đã trích xuất</CardTitle>
        <p className="text-sm text-muted-foreground">
          Đây là thông tin đọc được từ giấy tờ bạn đã nộp, kiểm tra lại xem có đúng không nhé.
        </p>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="rounded-lg bg-muted/40 p-3">
              <dt className="text-xs text-muted-foreground">{field.label}</dt>
              <dd className="mt-1 text-base font-medium">{field.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
