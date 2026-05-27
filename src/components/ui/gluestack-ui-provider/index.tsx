import React from "react";
import { View } from "react-native";
import { GluestackUIProvider as NativeProvider } from "@gluestack-ui/nativewind";
import { config } from "./config";

type Mode = "light" | "dark" | "system";

interface GluestackUIProviderProps {
  readonly mode?: Mode;
  readonly children: React.ReactNode;
}

export function GluestackUIProvider({
  mode = "light",
  children,
}: GluestackUIProviderProps) {
  const variables = mode === "dark" ? config.dark : config.light;

  return (
    <View style={[variables, { flex: 1 }]}>
      <NativeProvider>{children}</NativeProvider>
    </View>
  );
}
