// Evidence policy is advisory until independently verified by a reviewer.
const STATUSES = new Set(["verified_primary","corroborated","unverified_claim","inference","disputed","outdated","unknown"]);
export function assessEvidence(record) {
  if (!record || typeof record !== "object") throw new TypeError("Invalid record");
  const status = STATUSES.has(record.evidence_status) ? record.evidence_status : "unknown";
  const url = typeof record.source_url === "string" ? record.source_url : "";
  const hasHttpsSource = /^https:\/\//i.test(url);
  const reviewDue = typeof record.review_due_at === "string" ? record.review_due_at : "";
  return {
    id: typeof record.id === "string" ? record.id : null,
    evidence_status: status,
    source_link_present: hasHttpsSource,
    independent_verification_completed: false,
    requires_reviewer: true,
    review_due_at: reviewDue
  };
}
