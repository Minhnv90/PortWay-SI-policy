export type MapLayer = "Tất cả" | "Hiện trạng" | "Dự án" | "Góc nhìn"
const city = "https://hdnd.hochiminhcity.gov.vn/tin-tuc/tin-tong-hop/cum-sieu-cang-cai-mep-thi-vai-can-gio-hut-cac-tap-doan-hang-tau-hang-dau-the-gioi"

export const bayNodes = [
  { id: "cai-mep-thi-vai", label: "Cái Mép – Thị Vải", x: 67, y: 22, kind: "Hiện trạng", status: "Đang khai thác", date: "09/10/2026", detail: "CMIT và TCTT đưa bến chung vào khai thác thương mại. Đây là mốc của hai bến, không phải tiến độ của toàn cụm.", source: "CMIT · Công bố khai thác bến chung", url: "https://www.cmit.com.vn/en/News/cmit-and-tctt-officially-launch-commercial-operations-at-joint-berth" },
  { id: "long-son", label: "Long Sơn", x: 83, y: 51, kind: "Hiện trạng", status: "Khu bến hiện hữu", date: "31/10/2025", detail: "Quy hoạch chi tiết ghi nhận các cầu cảng hiện hữu tại Long Sơn. Không đồng nhất với dự án bến cảng tổng hợp mới.", source: "Bộ Xây dựng · Quyết định 1922/QĐ-BXD", url: "https://moc.gov.vn/Images/FileVanBan/BXD_1922-QD-BXD_31102025.pdf" },
  { id: "cai-mep-ha", label: "Cái Mép Hạ", x: 57, y: 42, kind: "Dự án", status: "Đã tổ chức khởi công giai đoạn 1", date: "01/07/2026", detail: "Mốc khởi công của Cảng tổng hợp và container Cái Mép Hạ giai đoạn 1. Không phản ánh tỷ lệ thi công hay xác nhận khai thác.", source: "Báo Điện tử Chính phủ · Thông tin khởi công", url: "https://cms.baochinhphu.vn/tphcm-khoi-cong-dong-loat-8-du-an-trong-diem-chao-mung-50-nam-thanh-pho-vinh-du-mang-ten-bac-102260701090536761.htm" },
  { id: "ha-luu", label: "Cái Mép Hạ hạ lưu", x: 56, y: 67, kind: "Dự án", status: "Đã chấp thuận đầu tư phân khu cảng", date: "20/11/2026", detail: "HĐND TP.HCM đưa tin phân khu số 3, khu bến container, đã được chấp thuận chủ trương đầu tư và nhà đầu tư. Không phải xác nhận cho toàn bộ tổ hợp hoặc đã khai thác.", source: "HĐND TP.HCM · Cập nhật phân khu 3", url: city },
  { id: "can-gio", label: "Cần Giờ", x: 27, y: 64, kind: "Dự án", status: "Đang làm thủ tục để khởi công", date: "20/11/2026", detail: "Theo cập nhật của HĐND TP.HCM, liên danh đã được chấp thuận đang làm thủ tục để khởi công cảng trung chuyển. Không phải thông báo mở cảng hay nhận booking.", source: "HĐND TP.HCM · Cập nhật Cần Giờ", url: city },
] as const

export function nodesFor(layer: MapLayer) {
  return layer === "Tất cả" ? bayNodes : bayNodes.filter((node) => node.kind === layer)
}
