import { GluestackUIProvider as GluestackProvider } from "@gluestack-ui/themed";
import { config } from "./config";
import { useColorScheme } from "react-native";

export function GluestackUIProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  return (
    <GluestackProvider config={config} colorMode={colorScheme ?? "light"}>
      {children}
    </GluestackProvider>
  );
}
