import type { Correction } from "../lib/parser";

export function CorrectionPopup({ correction }: { correction: Correction }) {
  return (
    <div
      className="absolute bottom-full left-0 bg-content4 rounded-lg p-2.5 mb-1.5 max-w-[320px] z-[100] shadow-lg"
    >
      <p className="text-success text-sm font-semibold">
        {correction.corrected}
      </p>
      <p className="text-default-600 text-xs mt-1">
        {correction.reason}
      </p>
    </div>
  );
}
