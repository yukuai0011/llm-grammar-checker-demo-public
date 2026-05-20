export interface Correction {
  original: string;
  corrected: string;
  reason: string;
  startIndex: number;
  endIndex: number;
}

const SYSTEM_PROMPT = `You are a grammar checker. Given text, find grammar, spelling, and punctuation errors.
Return a JSON array of corrections. Each correction must have:
- "original": the exact text fragment with the error
- "corrected": the corrected version
- "reason": a brief explanation

If no errors are found, return an empty array [].
Return ONLY the JSON array, no other text.`;

export function buildMessages(text: string): { role: "system" | "user"; content: string }[] {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: text },
  ];
}

export function parseResponse(text: string, originalText: string): Correction[] {
  let parsed: { original: string; corrected: string; reason: string }[];

  // Try to extract JSON from markdown code blocks if present
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();

  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error(
      "The LLM returned an unexpected format. Try again or try a different model."
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error(
      "The LLM returned an unexpected format. Try again or try a different model."
    );
  }

  const corrections: Correction[] = [];
  const usedRanges: [number, number][] = [];

  for (const item of parsed) {
    if (!item.original || !item.corrected || !item.reason) continue;
    if (item.original === item.corrected) continue;

    const startIndex = originalText.indexOf(item.original);
    if (startIndex === -1) continue;

    const endIndex = startIndex + item.original.length;

    // Skip overlapping corrections — take first match only
    const overlaps = usedRanges.some(
      ([s, e]) => startIndex < e && endIndex > s
    );
    if (overlaps) continue;

    usedRanges.push([startIndex, endIndex]);
    corrections.push({
      original: item.original,
      corrected: item.corrected,
      reason: item.reason,
      startIndex,
      endIndex,
    });
  }

  // Sort by position in text
  corrections.sort((a, b) => a.startIndex - b.startIndex);

  return corrections;
}
