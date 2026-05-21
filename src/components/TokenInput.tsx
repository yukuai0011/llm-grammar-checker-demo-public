import { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";

export interface LLMSettings {
  apiKey: string;
  baseUrl: string;
  model: string;
}

const STORAGE_KEY = "llm-grammar-settings";

const DEFAULTS: LLMSettings = {
  apiKey: "",
  baseUrl: "https://api.openai.com/v1",
  model: "gpt-4o-mini",
};

export function loadSettings(): LLMSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULTS, ...JSON.parse(stored) };
  } catch {
    // ignore
  }
  return { ...DEFAULTS };
}

export function saveSettings(settings: LLMSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function TokenInput({
  settings,
  onChange,
}: {
  settings: LLMSettings;
  onChange: (s: LLMSettings) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box className="mb-4">
      <Pressable onPress={() => setExpanded(!expanded)}>
        <HStack className="items-center gap-2">
          <Text className="text-base font-semibold">Settings</Text>
          <Text className="text-xs text-typography-500">
            {expanded ? "▲" : "▼"}
          </Text>
        </HStack>
      </Pressable>

      {expanded && (
        <VStack className="mt-3 gap-2.5">
          <Box>
            <Text className="text-[13px] mb-1 text-typography-600">
              API Key
            </Text>
            <Input variant="outline" size="md">
              <InputField
                value={settings.apiKey}
                onChangeText={(apiKey) => onChange({ ...settings, apiKey })}
                placeholder="sk-..."
                secureTextEntry
              />
            </Input>
          </Box>
          <Box>
            <Text className="text-[13px] mb-1 text-typography-600">
              Base URL
            </Text>
            <Input variant="outline" size="md">
              <InputField
                value={settings.baseUrl}
                onChangeText={(baseUrl) => onChange({ ...settings, baseUrl })}
                placeholder="https://api.openai.com/v1"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Input>
          </Box>
          <Box>
            <Text className="text-[13px] mb-1 text-typography-600">
              Model
            </Text>
            <Input variant="outline" size="md">
              <InputField
                value={settings.model}
                onChangeText={(model) => onChange({ ...settings, model })}
                placeholder="gpt-4o-mini"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Input>
          </Box>
        </VStack>
      )}
    </Box>
  );
}
