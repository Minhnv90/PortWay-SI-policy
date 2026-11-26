# PortWay SI v33 · Kiểm tra lỗi tạo câu trả lời

Đây là mã nguồn cho môi trường test riêng. Không thay bản v9 đang dùng, không bật Mainnet, không xử lý KYC/KYB hay chuyển Pi thật.

## Thử ngay trên màn hình mở đầu

Mở **So hai báo giá mẫu** ngay dưới tiêu đề. Xác nhận A 1.130 USD giao kho, B 1.100 USD giao cảng, mốc hòa giá 30 USD và câu hỏi yêu cầu đối tác báo đủ phần phí để B giao đến cùng kho. Mở/đóng lại không gửi tin và không cần AI. Không có báo giá thật, nút gửi cho đối tác hay thu thập dữ liệu. Đây là mẫu khác với kịch bản 110 USD từng có trong chế độ Nghiên cứu.

## Thử trên máy tính

1. Giải nén ZIP. Mở Terminal trong thư mục có `package.json`.
2. Dùng Node.js 22 trở lên và pnpm: `pnpm install --frozen-lockfile`, rồi `pnpm dev`.
3. Để xem giao diện đầy đủ, mở bản test bằng Pi Browser có phiên đăng nhập Pi (trình duyệt máy tính thông thường không thay thế phiên Pi). Trong chat, chọn **Nghiên cứu (thử nghiệm)**, nạp câu mẫu so sánh báo giá và bấm gửi.
4. Kết quả mẫu phải có nhãn **Mô phỏng** và ngưỡng **110 USD**. Hỏi câu khác để kiểm tra app báo không có kịch bản mô phỏng. Tắt chế độ để trở về chat thường (chat thường vẫn dùng cấu hình AI Gateway riêng, không kiểm chứng kết nối AI bằng kết quả mẫu).

Không có phiên Pi trên máy tính? Chạy `node --test tests/research-demo.cjs` để kiểm tra phần xử lý, hoặc gọi API ở localhost với dữ liệu giả lập.

## Môi trường test

Dùng project/bản nháp riêng có hỗ trợ Next.js và API phía máy chủ. Không đưa ZIP này lên bằng cách ghi đè project đang chạy. Nếu cổng test không hỗ trợ Next.js server hoặc từ chối ZIP, giữ nguyên bản hiện tại; cần kiểm tra chính xác thông báo cổng test trước khi đổi cách triển khai.

Mặc định không gọi Cloudflare từ chế độ nghiên cứu. Chỉ quản trị viên mới được cân nhắc đặt biến môi trường máy chủ `PORTWAY_RESEARCH_LIVE=private-test` trên bản test đã chặn truy cập công khai và có hạn mức yêu cầu. Biến này chỉ bật kết nối, không thay thế xác thực hoặc hạn mức. Khi bật, máy chủ chuyển duy nhất câu hỏi hiện tại qua HTTPS đến PortWay Research Worker; không gửi tệp đính kèm, lịch sử chat, token, hồ sơ định danh hoặc thông tin ví. Câu hỏi và câu trả lời vẫn có thể xuất hiện trong lịch sử chat của Pi; chúng không được gửi lại trong yêu cầu chat thường. Chỉ dùng câu hỏi giả lập, không đưa dữ liệu cá nhân hay tài liệu mật vào ô nhập. Lỗi kết nối không tự chuyển sang nhà cung cấp khác; phản hồi từ Worker không gắn nhãn đã xác minh. Xóa biến trên và triển khai lại bản test để quay về mô phỏng.

## Cẩm nang cảng

Trong chat, mở **Công cụ khác → Cẩm nang nghiệp vụ cảng**. Có 14 mục, mỗi mục có quy trình, lưu ý và liên kết kiểm chứng. Ví dụ: chọn mục Hoa tiêu để xem ai xác nhận vùng hoa tiêu và thông báo hàng hải; chọn mục Hàng nhập để phân biệt D/O, trạng thái hải quan và điều kiện ra cổng.

Cẩm nang đọc được ngay trong giao diện. Chat thường chỉ lấy những mục liên quan để làm kiến thức nền, không biến tài liệu tĩnh thành xác nhận luồng, lịch, giá hoặc giấy phép. Chế độ Nghiên cứu mặc định vẫn là mô phỏng, không trả lời tự do. Kiểm tra phần xử lý với `node --test tests/*.cjs`. Không ghi đè bản Pi đang chạy hoặc dùng ZIP demo để phát hành Mainnet.

## Kinh tế số

Mở **Công cụ khác → Kinh tế số** để xem 8 mục, gồm định danh, chứng từ eBL, dữ liệu cảng–kho, đối soát, tài trợ thương mại, đo sử dụng AI và kiểm chứng blockchain. Mục cuối là kịch bản lô hàng từ cảng về kho dùng dữ liệu giả. Đối chiếu các nguồn ngay dưới từng mục. Không có ví, thanh toán, định danh hoặc tài trợ thật trong phần thêm mới này.

## v16: Điều hành cảng (bản thử tiếng Việt)

Mở **Công cụ khác → Điều hành cảng**. Thử ba vai trò: lãnh đạo xem bản nháp rồi xác nhận giao việc; nhân viên báo vướng, gỡ vướng rồi hoàn tất; khách hàng chỉ thấy tiến độ công khai của lô mẫu. Dùng **Đặt lại** để chạy lại tình huống. Thử trên màn hình điện thoại và máy tính.

Đây là mô phỏng trong một phiên mở trang, không phải đăng nhập hay phân quyền thật. Không đồng bộ giữa máy hoặc tab, không gửi thông báo thật, không gọi AI/API và không dùng dữ liệu cảng thật. Các tính năng v15 vẫn nằm trong app. Chưa triển khai lên Pi.

## v17: Bản đồ Gành Rái

Mở **Công cụ khác → Bản đồ Gành Rái**. Chạm một điểm hoặc tên bên dưới để xem trạng thái, ngày mốc và nguồn. Thử ba lớp **Hiện trạng**, **Dự án**, **Góc nhìn**, rồi quay về **Tất cả**. Đây là sơ đồ tương đối, dùng tài liệu tại các mốc ghi trên thẻ, không dùng dữ liệu trực tiếp, dẫn luồng, điều độ hay dự báo chính thức. Không cần ví hay đăng nhập mới.

## v18: Lô mẫu và giờ chốt sà lan

Vào **Công cụ khác → Bản đồ Gành Rái → Cái Mép – Thị Vải → Thử cảnh báo giờ chốt sà lan**. Kiểm tra ca đủ thời gian (11:00, +60 phút), có rủi ro (12:30, −30 phút), sát giờ (12:00, 0 phút), thiếu mốc và dữ liệu đã bị thay thế (không tính ETA). Ngày và giờ đều mô phỏng; dữ liệu không kết nối với cảng. Thay đổi tình huống hủy duyệt bản nháp. Nút duyệt chỉ đổi trạng thái trên màn hình, không gửi thông báo, không tạo booking và không xác nhận lỡ tàu mẹ.

## v19: Xác minh khung sà lan thay thế

Vào **Bản đồ Gành Rái → Cái Mép – Thị Vải → Thử cảnh báo giờ chốt sà lan → Nguy cơ trễ**. Thử **Có khung thay thế** (giờ chốt mẫu 13:30, ETA 12:30, đệm 60 phút); sau đó chọn **Không còn chỗ**, hoặc **Bỏ xác nhận**. Mỗi lần thay đổi, bản nháp chuyển về chờ duyệt. Mọi trạng thái chỉ mô phỏng, không giữ chỗ hoặc gửi tin thật. GPS không nằm trong bản này.

## v20: Kiểm tra nối tàu mẹ

Từ tình huống **Nguy cơ trễ**, chọn **Có khung thay thế** rồi mở phần **Kiểm tra nối tàu mẹ** ngay bên dưới. Cùng mốc bàn giao mẫu 15:20, thử chốt 16:00 (+40 phút), 15:20 (0), 15:00 (−20) hoặc thiếu giờ chốt. Thay đổi mốc sẽ yêu cầu duyệt lại bản nháp. Kể cả khi còn thời gian, bản thử không xác nhận booking, hàng đã lên tàu hay lỡ chuyến. Không tích hợp GPS.

## v21: Phiếu bàn giao ca

Trong bài thử sà lan, mở **Bàn giao ca · Lô mẫu**. Thử đổi khung sà lan, giờ chốt tàu mẹ hoặc chuyển sang **Thiếu mốc** để xem bước cần xác minh. Nội dung bản nháp chỉ xuất hiện trong phiếu sau khi duyệt và biến mất nếu thay đổi dữ liệu. Phiếu dùng dữ liệu mẫu, chỉ hiển thị trong phiên; không lưu, gửi, đặt chỗ hay dùng GPS.

## v22: Xe giao container

Vào **Công cụ khác → Bản đồ Gành Rái → Cái Mép – Thị Vải → Thử xe giao container**. Thử đủ năm ca, đặc biệt so sánh **Tới cổng, chưa hạ bãi** với **Bãi xác nhận đã nhận**. Ca thiếu mốc không hiện dự báo; xác nhận bãi không phải bằng chứng lên tàu. Không liên thông trạng thái với bài thử sà lan, không tích hợp GPS, đặt chỗ hay cổng thật.

## v23: Theo dõi một lô container

Vào **Công cụ khác → Bản đồ Gành Rái → Cái Mép – Thị Vải → Theo dõi một lô container**. Chạy sáu mốc của lô mẫu, thử báo **Thiếu xác nhận của bãi** sau khi xe tới cổng. Gỡ vướng chỉ mở lại bước xác minh, không tự ghi nhận hạ bãi. Sau khi xác nhận từng chặng, dùng Đặt lại để thử từ đầu. Bản mô phỏng chạy trong một phiên; các bài thử riêng v22 vẫn còn.

## v24: Kiểm chứng chặn lệnh sai

Không thay đổi luồng thao tác v23. Bộ xử lý từ chối lệnh xác nhận thiếu mã bước, kể cả sau khi hoàn tất. Chạy lại ca đúng, nhảy bước, bấm lặp, giữ/gỡ vướng, thiếu xác nhận và kết thúc đúng 6/6. Không tích hợp GPS.

Khi thiếu xác nhận hạ bãi, hàng mốc hiện **Thiếu xác nhận**, không hiện **Chưa tới bước**.

## v25: Kiến thức chứng từ lô hàng

**Công cụ khác → Chứng từ lô hàng**. Ba thẻ gấp gọn, có nguồn: báo giá không phải booking; tới cổng không phải hạ bãi; dự kiến không phải đã xếp tàu. Chat thường chỉ nhận hướng dẫn liên quan tới câu hỏi. Kiến thức tham khảo không phải bằng chứng cho lô cụ thể. Không thay đổi chế độ nghiên cứu, không kết nối cảng, ví hoặc GPS.

## v26: Kiểm chứng dịch vụ đã vận hành

**Công cụ khác → Chứng từ lô hàng → Giới thiệu ≠ đã vận hành.** Ba tầng: quảng bá, xác nhận vai trò, vận hành thương mại. Ví dụ có ngày và nguồn AirLand/RTA Dubai. Chat thường nhận hướng dẫn theo câu hỏi liên quan. Không xác nhận đối tác, giấy phép hay bán vé; không thêm tích hợp.

## v27: Không báo thành công khi câu trả lời rỗng

Khi trả lời thường, nếu lần có tìm kiếm lỗi hoặc không có nội dung đọc được, máy chủ thử lại một lần không dùng tìm kiếm. Nếu vẫn lỗi hoặc rỗng, báo lỗi thay vì hiện thẻ kết quả rỗng. Chế độ nghiên cứu giữ nguyên. Ca tìm kiếm và mô hình được thử bằng dữ liệu giả.

## v28: VGM và ba mốc độc lập

Trong **Công cụ khác → Chứng từ lô hàng**, mở **VGM, giờ chốt bãi và xếp tàu**. Ví dụ mẫu minh họa hạ bãi đúng giờ nhưng gửi VGM muộn; không coi thiếu bằng chứng là lỡ tàu. Nguồn IMO và hãng tàu chỉ làm tài liệu nền. Giữ bản sửa chặn câu trả lời rỗng v27; không thêm kết nối.

## v29: Bản tin kiểm chứng (bản thử riêng)
Mở Công cụ khác → Bản tin kiểm chứng. Ba tin có ngày, nguồn gốc và ghi chú về giới hạn. Đây là bản chụp biên tập, không phải nguồn trực tiếp hoặc dữ liệu tự nạp vào AI. Không ghi đè v28 đang thử trên Pi; chưa triển khai.

## v31 · Phòng thực hành AI

Mở **Công cụ khác → Phòng thực hành AI** trong giao diện tiếng Việt. Có ba tình huống: so báo giá khác điểm giao, phân biệt thử nghiệm với mục tiêu mở rộng của GXO/Apptronik, và phân quyền duyệt đổi ca.

Chọn phương án, đọc phản hồi, rồi **Đề xuất bài học**. Phương án sai bị chặn ở bước đối chiếu và có thể trả lại. Với phương án đúng, chọn **Đối chiếu bằng chứng → Duyệt mẫu** để hiện bài dùng lại. **Đặt lại** hoặc đổi tình huống sẽ xóa trạng thái trong phiên mô phỏng. Không ghi hồ sơ, không gửi dữ liệu, không huấn luyện mô hình. Liên kết nguồn chỉ mở nếu bạn bấm.

Chat thường có hai ghi chú biên soạn sẵn về GXO/Apollo và phê duyệt đổi ca cho đúng chủ đề. Đây là ngữ cảnh từ mã nguồn, không phải bài được lưu từ các nút mô phỏng. Chưa kiểm tra AI trực tiếp trên Pi.

## v32 · Giao việc AI, chứng từ và phê duyệt

Trong **Công cụ khác → Phòng thực hành AI**, mở **Mẫu giao việc AI: trước và sau**. So sánh câu yêu cầu chung chung với mẫu nêu rõ việc, bối cảnh, đầu ra và kiểm chứng. Sau đó chọn **Đọc chứng từ mờ và soạn nháp**. Kết quả đúng giữ nguyên giờ đọc rõ, không đoán mã container, xin bản rõ và chỉ soạn nháp để người phụ trách duyệt. Mẫu chỉ bằng chữ: không camera, không đọc ảnh, tải tệp hay gửi xác nhận.

Chat thường có thêm hướng dẫn cố định cho câu hỏi về ảnh chứng từ; phiên bản này vẫn chỉ nhận văn bản. Không kết nối trình đọc ảnh hay cấp quyền hành động cho AI.

## v33 · Chẩn đoán chat thường

Khi chat lỗi, mở **Chi tiết** và ghi lại **Mã tra cứu** (nếu hiển thị). Người vận hành đối chiếu mã đó với bản ghi `portway.chat` trên máy chủ. Bản ghi chỉ có mã, bước và nhóm lỗi; không có câu hỏi, khóa, nội dung lỗi nhà cung cấp hay thông tin khách. Mất kết nối trước khi nhận phản hồi sẽ không có mã tra cứu.

Chat vẫn dùng AI Gateway. Nếu lần có tìm kiếm không có kết quả, có thể thử một lần không tìm kiếm. Lỗi xác thực, quyền truy cập, thanh toán/hạn mức hoặc giới hạn tốc độ không tự gửi lại. Bản thử chưa đổi khoá hay cấu hình nhà cung cấp. Nếu quản trị viên đã xác nhận quyền và chi phí trên chính project thử riêng, có thể đặt biến máy chủ tùy chọn `PORTWAY_CHAT_FALLBACK_MODEL` thành `anthropic/claude-sonnet-5` hoặc `anthropic/claude-sonnet-4.6` qua cùng AI Gateway; mặc định giữ Sonnet 5.5. Không đặt biến public, không đưa khoá vào chat. Chế độ Nghiên cứu/Cloudflare không đổi. Quy trình được kiểm bằng phản hồi giả; chưa gọi AI trên Pi.
