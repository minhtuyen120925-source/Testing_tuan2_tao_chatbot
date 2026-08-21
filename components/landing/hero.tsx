import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="pt-44">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="max-w-2xl text-balance text-5xl font-medium tracking-tight md:text-6xl lg:mt-16">
          Tư vấn hồ sơ du học, rõ ràng từ báo giá đến xét duyệt
        </h1>

        <p className="mt-6 max-w-2xl text-balance text-muted-foreground md:text-lg">
          Biết giá ngay khi điền form, nộp hồ sơ online và theo dõi hồ sơ của
          mình đạt hay chưa đạt điểm chuẩn từng trường.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="#bao-gia">Nhận báo giá ngay</Link>}
          />
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            render={<Link href="/portal">Vào cổng hồ sơ</Link>}
          />
        </div>

        <div className="relative mt-10 overflow-hidden rounded-3xl shadow-2xl shadow-black/10 ring-1 ring-foreground/6.5 sm:mt-14">
          <Image
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2400&auto=format&fit=crop"
            alt="Sinh viên tung mũ tốt nghiệp sau khi hoàn tất chương trình du học"
            width={2400}
            height={1000}
            priority
            className="aspect-21/9 w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
