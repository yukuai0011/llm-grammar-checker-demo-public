import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";

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
    <View style={{ marginBottom: 16 }}>
      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Settings</Text>
        <Text style={{ fontSize: 12, color: "#666" }}>
          {expanded ? "▲" : "▼"}
        </Text>
      </Pressable>

      {expanded && (
        <View style={{ marginTop: 12, gap: 10 }}>
          <View>
            <Text style={{ fontSize: 13, marginBottom: 4, color: "#555" }}>
              API Key
            </Text>
            <TextInput
              value={settings.apiKey}
              onChangeText={(apiKey) => onChange({ ...settings, apiKey })}
              placeholder="sk-..."
              secureTextEntry
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 6,
                padding: 8,
                fontSize: 14,
              }}
            />
          </View>
          <View>
            <Text style={{ fontSize: 13, marginBottom: 4, color: "#555" }}>
              Base URL
            </Text>
            <TextInput
              value={settings.baseUrl}
              onChangeText={(baseUrl) => onChange({ ...settings, baseUrl })}
              placeholder="https://api.openai.com/v1"
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 6,
                padding: 8,
                fontSize: 14,
              }}
            />
          </View>
          <View>
            <Text style={{ fontSize: 13, marginBottom: 4, color: "#555" }}>
              Model
            </Text>
            <TextInput
              value={settings.model}
              onChangeText={(model) => onChange({ ...settings, model })}
              placeholder="gpt-4o-mini"
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 6,
                padding: 8,
                fontSize: 14,
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}
