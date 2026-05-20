import { View } from "react-native";
import { GrammarChecker } from "../components/GrammarChecker";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        paddingTop: 40,
      }}
    >
      <GrammarChecker />
    </View>
  );
}
