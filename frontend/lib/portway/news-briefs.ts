// Editorial snapshot. Only add a brief after examining the primary source.
export const NEWS_REVIEWED_ON = "2026-11-23"

export const NEWS_BRIEFS = [
  {
    id: "iea-power",
    date: "2026-11",
    source: "IEA · World Energy Outlook 2026",
    url: "https://www.iea.org/files/41082112-1153-4b16-b738-d44fb273dfd9/WorldEnergyOutlook2026.pdf",
    status: "Phân tích và dự báo",
    title: "Điện cho AI: kế hoạch không phải công suất đang chạy",
    fact: "IEA ghi nhận nhiều kế hoạch phát điện bằng khí tại chỗ cho trung tâm dữ liệu và nêu thời gian chờ turbine là một trở ngại.",
    implication: "Khi rà tiến độ đầu tư, kiểm riêng nguồn điện và lịch giao thiết bị. Không suy ra cước tàu sẽ tăng.",
  },
  {
    id: "wb-ffi",
    date: "2026-04-01",
    source: "World Bank · FFI in Action",
    url: "https://www.worldbank.org/en/news/feature/2026/04/01/ffi-in-action-turning-cross-border-challenges-into-global-solutions",
    status: "Cơ chế vốn được công bố",
    title: "FFI: chia sẻ chi phí cho lợi ích xuyên biên giới",
    fact: "Trong ví dụ Angola–Namibia, World Bank tách khoản vay bổ sung và kéo dài kỳ hạn khỏi khoản tài trợ bù chi phí ban đầu.",
    implication: "Khi nghiên cứu điện bờ ở Gành Rái, tách lợi ích trong nước và giảm phát thải toàn cầu. Chưa xác nhận tài trợ cho bất kỳ dự án địa phương nào.",
  },
  {
    id: "cmit-empty",
    date: "2026-04",
    source: "CMIT · Quy trình thủ tục tại cổng cảng",
    url: "https://www.cmit.com.vn/UploadFiles/TinyUpload/Files/procedure/CMIT%20-%20Quy%20trinh%20thu%20tuc%20cong%20cang%202026%20-%20Version%2004-2026.pdf",
    status: "Hướng dẫn nghiệp vụ đã công bố",
    title: "Nhận cont rỗng: quyền nhận không thay thế hồ sơ xe",
    fact: "Hướng dẫn CMIT tách booking và duyệt lệnh từ hãng tàu, giấy giới thiệu của đơn vị được chủ hàng ủy quyền, và hồ sơ tài xế/phương tiện.",
    implication: "Kiểm đúng thủ tục nhận rỗng. Tài liệu không xác nhận quyền đổi lịch lấy cont hoặc tình trạng của một booking cụ thể.",
  },
] as const
