export const PORTWAY_DRAFT_LIMIT = 2000;

/** Append recognized words to an editable draft; this never sends a message. */
export function appendVoiceDraft(draft: string, transcript: string): string {
  const words = transcript.trim();
  if (!words) return draft;
  const separator = draft && !/\s$/u.test(draft) ? " " : "";
  const room = PORTWAY_DRAFT_LIMIT - draft.length - separator.length;
  if (room <= 0) return draft;
  // The textarea limit counts UTF-16 units. Avoid leaving half a surrogate.
  const fit = words.slice(0, room).replace(/[\uD800-\uDBFF]$/u, "");
  return fit ? draft + separator + fit : draft;
}
