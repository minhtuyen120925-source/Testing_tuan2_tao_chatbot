import { Pencil, Plus, Trash2 } from "lucide-react";
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
import { schools } from "@/lib/mock-data";

export default function AdminSchoolsPage() {
  return (
    <>
      <AdminPageHeader
        title="Trường tham chiếu"
        description="Điểm chuẩn dùng để đối chiếu hồ sơ học viên."
        action={
          <Button>
            <Plus className="size-4" />
            Thêm trường mới
          </Button>
        }
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên trường</TableHead>
              <TableHead>Quốc gia</TableHead>
              <TableHead>Điểm học tập tối thiểu</TableHead>
              <TableHead>Điểm IELTS tối thiểu</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools.map((school) => (
              <TableRow key={school.id}>
                <TableCell className="font-medium">{school.name}</TableCell>
                <TableCell>{school.country}</TableCell>
                <TableCell>{school.minGpa.toFixed(1)}</TableCell>
                <TableCell>{school.minIelts.toFixed(1)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button size="icon-sm" variant="outline" aria-label="Sửa">
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button size="icon-sm" variant="outline" aria-label="Xoá">
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
