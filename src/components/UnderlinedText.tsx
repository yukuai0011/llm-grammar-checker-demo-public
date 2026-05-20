import { useState } from "react";
import { View, Text } from "react-native";
import type { Correction } from "../lib/parser";
import { CorrectionPopup } from "./CorrectionPopup";

export function UnderlinedText({
  text,
  corrections,
}: {
  text: string;
  corrections: Correction[];
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Build segments: split text into corrected and normal parts
  const segments: { text: string; correction?: Correction }[] = [];
  let lastEnd = 0;

  for (const correction of corrections) {
    if (correction.startIndex > lastEnd) {
      segments.push({ text: text.slice(lastEnd, correction.startIndex) });
    }
    segments.push({ text: correction.original, correction });
    lastEnd = correction.endIndex;
  }
  if (lastEnd < text.length) {
    segments.push({ text: text.slice(lastEnd) });
  }

  const renderSegment = (
    seg: { text: string; correction?: Correction },
    idx: number
  ) => {
    const isHovered = hoveredIndex === idx;
    const hasCorrection = !!seg.correction;

    return (
      <span
        key={idx}
        onMouseEnter={() => hasCorrection && setHoveredIndex(idx)}
        onMouseLeave={() => setHoveredIndex(null)}
        style={{
          position: "relative",
          textDecoration: hasCorrection ? "wavy underline red" : "none",
          cursor: hasCorrection ? "pointer" : "default",
          backgroundColor: isHovered ? "rgba(255, 0, 0, 0.08)" : "transparent",
          whiteSpace: "pre-wrap",
        }}
      >
        {seg.text}
        {isHovered && seg.correction && (
          <CorrectionPopup correction={seg.correction} />
        )}
      </span>
    );
  };

  return (
    <View
      style={{
        padding: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        minHeight: 120,
      }}
    >
      <Text style={{ fontSize: 16, lineHeight: 24 }}>
        {segments.map(renderSegment)}
      </Text>
    </View>
  );
}
