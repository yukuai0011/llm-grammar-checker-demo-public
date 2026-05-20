import { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { TokenInput, loadSettings, saveSettings, type LLMSettings } from "./TokenInput";
import { UnderlinedText } from "./UnderlinedText";
import { chatCompletion } from "../lib/llm";
import { buildMessages, parseResponse, type Correction } from "../lib/parser";

type Mode = "edit" | "display";

export function GrammarChecker() {
  const [settings, setSettings] = useState<LLMSettings>(loadSettings);
  const [text, setText] = useState("");
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [mode, setMode] = useState<Mode>("edit");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const handleCheck = useCallback(async () => {
    if (!text.trim()) return;
    if (!settings.apiKey) {
      setError("Please enter your API key in Settings.");
      return;
    }

    setLoading(true);
    setError(null);
    setCorrections([]);

    try {
      const response = await chatCompletion(settings, buildMessages(text));
      const parsed = parseResponse(response, text);
      setCorrections(parsed);
      setMode("display");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [text, settings]);

  const handleEdit = useCallback(() => {
    setMode("edit");
    setCorrections([]);
    setError(null);
  }, []);

  return (
    <View style={{ maxWidth: 720, width: "100%", padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 4 }}>
        Grammar Checker
      </Text>
      <Text style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>
        Paste your text and let an LLM find grammar issues.
      </Text>

      <TokenInput settings={settings} onChange={setSettings} />

      {mode === "edit" ? (
        <View style={{ gap: 12 }}>
          <TextInput
            value={text}
            onChangeText={setText}
            multiline
            placeholder="Type or paste your text here..."
            spellCheck={false}
            autoCorrect={false}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              minHeight: 200,
              textAlignVertical: "top",
              lineHeight: 24,
            }}
          />
          <Pressable
            onPress={handleCheck}
            disabled={loading || !text.trim()}
            style={{
              backgroundColor: loading || !text.trim() ? "#ccc" : "#2563eb",
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                Check Grammar
              </Text>
            )}
          </Pressable>
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          <UnderlinedText text={text} corrections={corrections} />
          {corrections.length === 0 && !error && (
            <Text
              style={{
                color: "#16a34a",
                fontSize: 16,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              No grammar issues found!
            </Text>
          )}
          <Pressable
            onPress={handleEdit}
            style={{
              backgroundColor: "#6b7280",
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
              Edit
            </Text>
          </Pressable>
        </View>
      )}

      {error && (
        <Text style={{ color: "#dc2626", fontSize: 14, marginTop: 12 }}>
          {error}
        </Text>
      )}
    </View>
  );
}
