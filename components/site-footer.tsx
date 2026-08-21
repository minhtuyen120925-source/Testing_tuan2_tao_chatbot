import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-10 px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-full lg:col-span-2">
            <Logo uniColor />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Tư vấn hồ sơ du học, rõ ràng từ báo giá đến xét duyệt. Đồng hành cùng
              học viên từ bước chọn trường đến khi hoàn tất hồ sơ.
            </p>
          </div>

          <div>
            <span className="text-sm font-medium text-foreground">Liên hệ</span>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                <span>hotro@duhoc24.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" />
                <span>1900 636 999</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" />
                <span>Quận 1, TP. Hồ Chí Minh</span>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-sm font-medium text-foreground">Liên kết</span>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground duration-150 hover:text-primary">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground duration-150 hover:text-primary">
                  Điểm chuẩn các trường
                </Link>
              </li>
              <li>
                <Link href="/portal" className="text-muted-foreground duration-150 hover:text-primary">
                  Cổng hồ sơ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 DuHoc24. Website mẫu dùng cho mục đích đào tạo.
          </p>
        </div>
      </div>
    </footer>
  );
}
