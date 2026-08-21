import Image from "next/image";
import { Clock, ShieldCheck, Sparkles } from "lucide-react";

const highlights = [
  {
    icon: Sparkles,
    title: "Báo giá tức thì",
    description: "Báo giá sẽ được gửi trực tiếp vào email đã đăng ký.",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop",
  },
  {
    icon: ShieldCheck,
    title: "Đối chiếu điểm chuẩn minh bạch",
    description:
      "Điểm học tập và IELTS của bạn được so trực tiếp với điểm chuẩn từng trường để biết kết quả đạt hay không.",
    image:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=800&auto=format&fit=crop",
  },
  {
    icon: Clock,
    title: "Phản hồi trong 24h",
    description:
      "Gửi yêu cầu báo giá hoặc nộp hồ sơ xong, tư vấn viên sẽ liên hệ lại với bạn trong vòng 24 giờ.",
    image:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop",
  },
];

export function Highlights() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {highlights.map(({ icon: Icon, title, description, image }) => (
            <div key={title}>
              <div className="relative overflow-hidden rounded-2xl shadow-sm shadow-black/5 ring-1 ring-foreground/6.5">
                <Image
                  src={image}
                  alt={title}
                  width={800}
                  height={600}
                  className="aspect-4/3 w-full object-cover"
                />
                <span className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-xl bg-background shadow-sm ring-1 ring-foreground/10">
                  <Icon className="size-5" />
                </span>
              </div>
              <h3 className="mt-4 text-lg font-medium">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
