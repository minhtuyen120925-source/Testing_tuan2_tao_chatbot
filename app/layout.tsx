import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DuHoc24 — Cổng Tiếp Nhận Hồ Sơ Du Học",
  description:
    "Tư vấn hồ sơ du học, rõ ràng từ báo giá đến xét duyệt. Nhận báo giá tức thì, nộp hồ sơ trực tuyến và theo dõi kết quả đối chiếu điểm chuẩn.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
