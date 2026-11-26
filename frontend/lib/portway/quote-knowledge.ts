type QuoteGuide = { id: string; match: RegExp; check: string; limit: string; sources?: readonly string[] };

export const QUOTE_GUIDES: readonly QuoteGuide[] = [
  {id:"same-scope", match:/\b(bao gia|quote|quotation|all in|tron goi)\b/,
   check:"Trước khi cộng giá, đưa hai báo giá về cùng điểm đi/đến, loại và số lượng container, đơn vị tính, đồng tiền, thời hạn, thuế và phạm vi dịch vụ. Ghi riêng phí đã gồm, chưa gồm và chưa xác nhận.",
   limit:"Không coi khoản bỏ trống là 0. Không kết luận bên nào rẻ hơn nếu chưa so được cùng phạm vi."},
  {id:"port-to-door", match:/\b(cang ve kho|giao (toi|den|tan|ve) (cang|kho)|port to door|door to door|noi dia|keo cont)\b/,
   check:"Quy về cùng điểm giao cuối. Đối chiếu cước từ cảng về kho, phí nâng hạ, thời gian chờ và trả vỏ nếu áp dụng; chỉ cộng khoản còn thiếu để tránh đếm hai lần.",
   limit:"Chênh giá niêm yết chỉ là ngưỡng cho chi phí còn thiếu, không phải báo giá vận chuyển thực tế."},
  {id:"surcharges", match:/\b(phu phi|free time|demurrage|detention|luu bai|luu container|thc|local charges)\b/,
   check:"Yêu cầu báo giá hoặc biểu phí của đúng hãng/bến, địa bàn, loại container và ngày áp dụng. Kiểm tra ngày lịch hay ngày làm việc, biểu tính gộp hay tách và mốc bắt đầu/kết thúc thời gian miễn phí và khoản tính riêng: lưu container, lưu bãi, điện lạnh hoặc phí khác nếu có.",
   limit:"Không gán một số ngày miễn phí hoặc mức phí cho mọi hãng, cảng, loại hàng. Tính ngưỡng hòa vốn với số liệu cùng phạm vi; phí bằng ngưỡng là hòa.",
   sources:["https://www.maersk.com/local-information/asia-pacific/vietnam/import","https://www.maersk.com/local-information/asia-pacific/vietnam/export"]},
  {id:"delivery-risk", match:/\b(incoterms|cfr|cif|cpt|cip|dap|dpu|ddp)\b/,
   check:"Ghi đúng quy tắc, cảng hoặc địa điểm cụ thể và phiên bản Incoterms®. Với nhóm C, nơi đến được nêu là điểm người bán thu xếp và trả cước, không mặc định là điểm chuyển rủi ro. Xác định điểm giao theo quy tắc dùng trong hợp đồng.",
   limit:"Không suy từ Incoterms® ra thuế, giá cước cụ thể hoặc việc bên nào đã thanh toán một khoản.",
   sources:["https://library.iccwbo.org/clp/clp-incoterms-qa-2020.htm?AGENT=ICC_HQ"]},
];
const plain = (s:string) => s.normalize("NFD").replace(/\p{M}/gu,"").replace(/đ/gi,"d").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
export function formatQuoteContext(question:string) {
  const q=plain(question);
  const hits=QUOTE_GUIDES.filter(g=>g.match.test(q));
  return hits.length ? "PORTWAY QUOTE PLAYBOOK — internal decision checklist, not external evidence or tariffs. Lead with the arithmetic or missing fact; keep it brief.\n" +
    hits.map(g=>"- "+g.check+" "+g.limit+(g.sources?.length ? " Background source only, not proof for this shipment: "+g.sources.join(" | ") : "")).join("\n") : "";
}
