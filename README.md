# DuHoc24 - Website mẫu "Cổng Tiếp Nhận Hồ Sơ Du Học"

Repo mẫu dùng cho khoá lập trình 6 tuần. Bản này (Tuần 1) chỉ dựng UI, toàn bộ dữ liệu là **mock data viết cứng** trong [`lib/mock-data.ts`](lib/mock-data.ts),
chưa nối API hay database thật.

## Bắt đầu

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Các route

| Route | Mô tả |
|---|---|
| `/` | Landing page: hero, form báo giá, chatbot QnA (UI tĩnh), 3 điểm nổi bật, footer |
| `/portal` | Cổng hồ sơ học viên: upload giấy tờ, thông tin trích xuất, đối chiếu điểm chuẩn |
| `/admin` | Chuyển hướng đến `/admin/requests` |
| `/admin/requests` | Danh sách yêu cầu báo giá |
| `/admin/schools` | Danh sách trường tham chiếu (điểm chuẩn) |
| `/admin/profiles` | Hồ sơ học viên và trạng thái giấy tờ |
| `/admin/conversations` | Lịch sử hội thoại chatbot |

Trang `/login` chưa được dựng ở bước này. Học viên sẽ tự dựng ở Tuần 6.

## Lộ trình tính năng theo tuần

Bản hiện tại (Tuần 1) chỉ có UI tĩnh và mock data, chưa gọi API hay database thật. Các tuần tiếp theo sẽ lần lượt thêm:

### Tuần 2 - Chatbot QnA thật
- [ ] Chatbot gọi Gemini API thật, trả lời dựa trên bộ QnA cho sẵn (`systemInstruction`)
- [ ] Giữ mạch hội thoại trong phiên làm việc

### Tuần 3 - Supabase, form báo giá, dashboard
- [ ] Kết nối Supabase (qua Connector), tạo bảng `requests`, `schools`, `conversations`/`messages`
- [ ] Form báo giá hoạt động thật, lưu yêu cầu vào database
- [ ] Lưu lịch sử chat QnA vào database
- [ ] `/schools` hiển thị dữ liệu điểm chuẩn thật
- [ ] `/admin/requests` và `/admin/conversations` nối dữ liệu thật, có nút Duyệt/Từ chối
- [ ] Deploy lên Vercel

### Tuần 4 - Đọc & xử lý hồ sơ giấy tờ
- [ ] Upload và đọc file (PDF bảng điểm, ảnh IELTS, ảnh ID) bằng Gemini
- [ ] Trích xuất dữ liệu có cấu trúc (structured output) thay vì trả lời tự do
- [ ] Đối chiếu checklist giấy tờ, lưu hồ sơ học viên vào bảng `student_profiles`
- [ ] So sánh điểm với bảng `schools`, hiển thị kết quả đạt/chưa đạt
- [ ] `/admin/profiles` nối dữ liệu thật
- [ ] Ví dụ function calling riêng, phục vụ mục đích học, chưa nằm trong luồng chính

### Tuần 5 - Tự động hoá qua Make.com
- [ ] Tự động gửi email báo giá khi có yêu cầu mới
- [ ] Tự động gửi email mời đăng nhập khi admin duyệt yêu cầu

### Tuần 6 - Authentication & hoàn thiện
- [ ] Trang `/login` (magic link qua Supabase Auth), UI mới hoàn toàn, chưa có sẵn ở bản này
- [ ] Row Level Security, khoá `/portal` chỉ cho người đã đăng nhập
- [ ] Ghép hoàn chỉnh toàn bộ luồng, sẵn sàng demo

## Công nghệ

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS v4
- [shadcn/ui](https://ui.shadcn.com) (style `base-nova`, nền tảng [Base UI](https://base-ui.com))
- Khối giao diện nền: [`@tailark-oss/dusk-landing-2`](https://tailark.com), đã chuyển sang light theme và tuỳ biến theo nội dung dịch vụ du học

## Biến môi trường

Chưa cần thiết để chạy `npm run dev` ở bản này. Xem [`.env.example`](.env.example)
cho danh sách biến sẽ dùng khi nối Gemini (Tuần 2), Supabase (Tuần 3) và đăng nhập magic link (Tuần 6).

## Deploy

Repo có cấu trúc chuẩn Next.js App Router, deploy trực tiếp lên [Vercel](https://vercel.com/new)
mà không cần cấu hình thêm.