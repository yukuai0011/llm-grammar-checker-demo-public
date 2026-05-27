import { useState, useEffect, useCallback } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import {
  TokenInput,
  loadSettings,
  saveSettings,
  type LLMSettings,
} from "./TokenInput";
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
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred."
      );
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
    <Box className="max-w-2xl w-full p-6">
      <Heading className="text-2xl font-bold mb-1">Grammar Checker</Heading>
      <Text className="text-sm text-typography-500 mb-6">
        Paste your text and let an LLM find grammar issues.
      </Text>

      <TokenInput settings={settings} onChange={setSettings} />

      {mode === "edit" ? (
        <VStack className="gap-3">
          <Input className="rounded-lg border border-border-300 flex-row overflow-hidden">
            <InputField
              value={text}
              onChangeText={setText}
              multiline
              placeholder="Type or paste your text here..."
              spellCheck={false}
              autoCorrect={false}
              className="p-3 min-h-[200px] text-base leading-6 text-typography-900 text-top"
            />
          </Input>
          <Button
            onPress={handleCheck}
            disabled={loading || !text.trim()}
            className={`rounded-lg px-4 py-2 items-center justify-center ${
              loading || !text.trim()
                ? "bg-background-300"
                : "bg-primary-600"
            }`}
          >
            {loading ? (
              <ButtonSpinner />
            ) : (
              <ButtonText className="text-white font-semibold">
                Check Grammar
              </ButtonText>
            )}
          </Button>
        </VStack>
      ) : (
        <VStack className="gap-3">
          <UnderlinedText text={text} corrections={corrections} />
          {corrections.length === 0 && !error && (
            <Text className="text-success-600 text-base font-semibold text-center">
              No grammar issues found!
            </Text>
          )}
          <Button
            onPress={handleEdit}
            className="rounded-lg px-4 py-2 border border-border-400 items-center justify-center"
          >
            <ButtonText className="text-typography-700 font-semibold">
              Edit
            </ButtonText>
          </Button>
        </VStack>
      )}

      {error && (
        <Text className="text-error-600 text-sm mt-3">{error}</Text>
      )}
    </Box>
  );
}
