import { FileText, IdCard, LogOut, Medal } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { DocumentFeatures } from "@/components/portal/document-features";
import { ExtractedInfo } from "@/components/portal/extracted-info";
import { SchoolMatch } from "@/components/portal/school-match";
import { currentStudent } from "@/lib/mock-data";

export default function PortalPage() {
  const { documents, extracted, matches } = currentStudent;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-32">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
          <div>
            <p className="text-sm text-muted-foreground">Xin chào,</p>
            <h1 className="text-2xl font-medium tracking-tight">{currentStudent.name}</h1>
          </div>
          <Button variant="outline">
            <LogOut className="size-4" />
            Đăng xuất
          </Button>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-medium">Giấy tờ cần nộp</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Nộp đủ 3 loại giấy tờ dưới đây, hệ thống sẽ tự trích xuất thông tin và đối chiếu điểm chuẩn giúp bạn.
          </p>

          <div className="mt-6">
            <DocumentFeatures
              items={[
                {
                  icon: FileText,
                  title: "Bảng điểm (PDF)",
                  accept: "Chấp nhận PDF",
                  fileName: documents.transcript.fileName,
                  status: documents.transcript.status,
                },
                {
                  icon: Medal,
                  title: "Ảnh chứng chỉ IELTS",
                  accept: "Chấp nhận JPG, PNG",
                  fileName: documents.ielts.fileName,
                  status: documents.ielts.status,
                },
                {
                  icon: IdCard,
                  title: "Ảnh CMND/CCCD hoặc hộ chiếu",
                  accept: "Chấp nhận JPG, PNG",
                  fileName: documents.identity.fileName,
                  status: documents.identity.status,
                  reason: documents.identity.reason,
                },
              ]}
            />
          </div>

          <Button size="lg" className="mt-6 w-full sm:w-auto">
            Nộp hồ sơ
          </Button>
        </section>

        <section className="mt-12 space-y-6">
          <ExtractedInfo
            fullName={extracted.fullName}
            dateOfBirth={extracted.dateOfBirth}
            gpa={extracted.gpa}
            ielts={extracted.ielts}
          />
          <SchoolMatch matches={matches} />
        </section>
      </main>
    </>
  );
}
