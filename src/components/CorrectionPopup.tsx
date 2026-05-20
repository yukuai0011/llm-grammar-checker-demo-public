import { View, Text } from "react-native";
import type { Correction } from "../lib/parser";

export function CorrectionPopup({ correction }: { correction: Correction }) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: "100%",
        left: 0,
        backgroundColor: "#333",
        borderRadius: 8,
        padding: 10,
        marginBottom: 6,
        maxWidth: 320,
        zIndex: 100,
      }}
    >
      <Text style={{ color: "#4ade80", fontSize: 14, fontWeight: "600" }}>
        {correction.corrected}
      </Text>
      <Text style={{ color: "#ccc", fontSize: 12, marginTop: 4 }}>
        {correction.reason}
      </Text>
    </View>
  );
}
