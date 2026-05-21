import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import type { Correction } from "../lib/parser";

export function CorrectionPopup({ correction }: { correction: Correction }) {
  return (
    <Box
      className="absolute bottom-full left-0 bg-background-900 rounded-lg p-2.5 mb-1.5 max-w-[320px] z-[100]"
    >
      <Text className="text-success-400 text-sm font-semibold">
        {correction.corrected}
      </Text>
      <Text className="text-typography-300 text-xs mt-1">
        {correction.reason}
      </Text>
    </Box>
  );
}
