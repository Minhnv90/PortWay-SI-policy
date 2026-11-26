export const B2B_NEEDS = ["logistics", "sourcing", "technology"] as const;
export type B2BNeed = (typeof B2B_NEEDS)[number];

type NeedProfile = {
  label: string;
  candidates: string;
  criteria: [string, string, string];
  gaps: [string, string];
  ask: string;
};

export const B2B_PROFILES: Record<B2BNeed, NeedProfile> = {
  logistics: {
    label: "Logistics",
    candidates: "Nhóm đối tác phù hợp: đơn vị giao nhận hoặc vận tải có kinh nghiệm với loại hàng và khu vực cần phục vụ.",
    criteria: ["Phạm vi dịch vụ và tuyến có thể xác nhận.", "Báo giá tách phí, điều kiện giao và trách nhiệm.", "Đầu mối pháp nhân, chứng từ và quy trình xử lý sự cố."],
    gaps: ["Loại hàng, điểm lấy/giao và khung ngày.", "Điều kiện giao, yêu cầu chứng từ và hàng đặc thù (nếu có)."],
    ask: "phạm vi vận chuyển, thời gian dự kiến, cấu phần báo giá và quy trình xử lý phát sinh",
  },
  sourcing: {
    label: "Tìm nguồn hàng",
    candidates: "Nhóm đối tác phù hợp: nhà sản xuất hoặc nhà phân phối có thể cung cấp mẫu và chứng minh nguồn gốc.",
    criteria: ["Pháp nhân, vai trò và khả năng cung ứng.", "Mẫu, tiêu chuẩn và hồ sơ nguồn gốc.", "Số lượng tối thiểu, thời gian giao và cách xử lý lỗi."],
    gaps: ["Quy cách, số lượng và thị trường đích.", "Tiêu chuẩn bắt buộc, ngân sách và mốc cần hàng."],
    ask: "quy cách, mẫu thử, số lượng tối thiểu, thời gian giao và hồ sơ nguồn gốc",
  },
  technology: {
    label: "Công nghệ",
    candidates: "Nhóm đối tác phù hợp: nhà cung cấp có thể thử nghiệm quy trình hoặc tích hợp trong phạm vi nhỏ.",
    criteria: ["Có thể trình diễn quy trình cụ thể và đo kết quả.", "Phân quyền, dữ liệu, bảo mật và khả năng xuất dữ liệu.", "Chi phí triển khai, hỗ trợ và phương án rời dịch vụ."],
    gaps: ["Vấn đề cần giải quyết, người dùng và hệ thống đang có.", "Loại dữ liệu, chỉ số thành công và phạm vi thử nghiệm."],
    ask: "phạm vi thử nghiệm, phương án tích hợp, bảo vệ dữ liệu và tiêu chí nghiệm thu",
  },
};

export function introductionDraft(need: B2BNeed): string {
  const profile = B2B_PROFILES[need];
  return `Chào anh/chị,\n\nTôi là [tên] từ [doanh nghiệp]. Bên tôi đang tìm hiểu cơ hội hợp tác về ${profile.label.toLowerCase()} cho [mô tả nhu cầu không mật].\n\nAnh/chị có thể chia sẻ thông tin sơ bộ về ${profile.ask} không? Nếu phù hợp, hai bên có thể hẹn một buổi trao đổi ngắn để làm rõ nhu cầu.\n\nCảm ơn anh/chị,\n[tên / chức danh]`;
}

export function resolveB2BNeed(value: string): B2BNeed | undefined {
  return B2B_NEEDS.find((candidate) => candidate === value);
}

export function prepareB2BDraft(current: string, need: B2BNeed): string | null {
  return current.trim() ? null : introductionDraft(need);
}
