// PortWay-only approved knowledge retrieval adapter; no writes and no Health SI access.
export function createApprovedRetrieval(db) {
  if (!db || typeof db.prepare !== "function") throw new TypeError("PortWay staging D1 binding required");
  return {
    async searchApproved(query) {
      if (typeof query !== "string" || !query.trim() || query.length > 1000) throw new TypeError("Invalid query");
      const pattern = "%" + query.trim().replace(/[\\%_]/g, "\\$&") + "%";
      const result = await db.prepare("SELECT id,title,claim,summary,source_title,source_organization,source_url,last_checked_at,evidence_status FROM portway_knowledge WHERE approval_status = 'approved' AND (title LIKE ? ESCAPE '\\' OR claim LIKE ? ESCAPE '\\' OR summary LIKE ? ESCAPE '\\') LIMIT 8").bind(pattern, pattern, pattern).all();
      return result.results || [];
    },
    async getApprovedById(id) {
      if (typeof id !== "string" || !/^[a-zA-Z0-9_-]{1,120}$/.test(id)) throw new TypeError("Invalid id");
      const result = await db.prepare("SELECT id,title,claim,summary,source_title,source_organization,source_url,last_checked_at,evidence_status FROM portway_knowledge WHERE approval_status = 'approved' AND id = ? LIMIT 1").bind(id).first();
      return result || null;
    }
  };
}
