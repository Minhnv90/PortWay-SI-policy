CREATE INDEX IF NOT EXISTS idx_portway_knowledge_approved_modified ON portway_knowledge(approval_status, modified_at DESC);
