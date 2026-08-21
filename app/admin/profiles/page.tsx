import { AdminPageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { StatusDot, docStatusMeta } from "@/components/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { studentProfiles } from "@/lib/mock-data";

const docLabels = [
  { key: "transcript", label: "Bảng điểm" },
  { key: "ielts", label: "IELTS" },
  { key: "identity", label: "CMND/Hộ chiếu" },
] as const;

export default function AdminProfilesPage() {
  return (
    <>
      <AdminPageHeader
        title="Hồ sơ học viên"
        description="Trạng thái giấy tờ và kết quả đối chiếu điểm chuẩn của từng học viên."
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên học viên</TableHead>
              <TableHead>Trạng thái 3 giấy tờ</TableHead>
              <TableHead>Trường đạt</TableHead>
              <TableHead>Ngày nộp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentProfiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell className="font-medium">{profile.studentName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {docLabels.map(({ key, label }) => {
                      const status = profile.docs[key];
                      return (
                        <span
                          key={key}
                          title={`${label}: ${docStatusMeta[status].label}`}
                          className="flex items-center gap-1.5"
                        >
                          <StatusDot tone={docStatusMeta[status].tone} />
                        </span>
                      );
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  {profile.matchedSchools}/{profile.totalSchools} trường
                </TableCell>
                <TableCell className="text-muted-foreground">{profile.submittedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
