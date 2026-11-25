-- Read-only staging verification; no production changes.
PRAGMA table_info('portway_knowledge');
PRAGMA index_list('portway_knowledge');
SELECT approval_status, COUNT(*) AS records FROM portway_knowledge GROUP BY approval_status;
SELECT id,title,source_url FROM portway_knowledge WHERE approval_status='approved' AND (source_url NOT LIKE 'https://%' OR trim(body)='');
SELECT COUNT(*) AS rag_eligible FROM portway_knowledge WHERE approval_status='approved' AND source_url LIKE 'https://%' AND trim(body)<>'';
