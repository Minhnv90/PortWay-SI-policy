// MCP-compatible tool descriptors and safe dispatcher. This is NOT an MCP transport server.
export const READ_ONLY_TOOLS = Object.freeze([
  { name: "portway_search_approved", description: "Search approved PortWay knowledge records only", inputSchema: { type: "object", properties: { query: { type: "string", maxLength: 1000 } }, required: ["query"], additionalProperties: false } },
  { name: "portway_get_source", description: "Read an approved PortWay source record by ID", inputSchema: { type: "object", properties: { id: { type: "string", maxLength: 120 } }, required: ["id"], additionalProperties: false } }
]);
export async function dispatchReadOnlyTool(name, args, adapters) {
  if (!READ_ONLY_TOOLS.some(tool => tool.name === name)) throw new Error("Tool not allowlisted");
  if (!args || typeof args !== "object" || Array.isArray(args)) throw new TypeError("Invalid arguments");
  if (name === "portway_search_approved") {
    if (Object.keys(args).some(key => key !== "query") || typeof args.query !== "string" || !args.query.trim() || args.query.length > 1000) throw new TypeError("Invalid query");
    if (typeof adapters?.searchApproved !== "function") throw new Error("Read adapter unavailable");
    return adapters.searchApproved(args.query.trim());
  }
  if (Object.keys(args).some(key => key !== "id") || typeof args.id !== "string" || !/^[a-zA-Z0-9_-]{1,120}$/.test(args.id)) throw new TypeError("Invalid id");
  if (typeof adapters?.getApprovedById !== "function") throw new Error("Read adapter unavailable");
  return adapters.getApprovedById(args.id);
}
