import { useState, useEffect, useCallback } from "react";
import { Button, Input, TextArea, Spinner, Card, CardContent } from "@heroui/react";
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
        err instanceof Error ? err.message : "An unexpected error occurred."
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
    <div className="max-w-2xl w-full">
      <h1 className="text-2xl font-bold mb-1">Grammar Checker</h1>
      <p className="text-sm text-default-500 mb-6">
        Paste your text and let an LLM find grammar issues.
      </p>

      <TokenInput settings={settings} onChange={setSettings} />

      {mode === "edit" ? (
        <div className="flex flex-col gap-3">
          <TextArea
            value={text}
            onChange={setText}
            placeholder="Type or paste your text here..."
            rows={8}
            spellCheck={false}
          />
          <Button
            onPress={handleCheck}
            isDisabled={loading || !text.trim()}
            color="primary"
            className="font-semibold"
          >
            {loading ? <Spinner size="sm" color="white" /> : "Check Grammar"}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <UnderlinedText text={text} corrections={corrections} />
          {corrections.length === 0 && !error && (
            <p className="text-success text-base font-semibold text-center">
              No grammar issues found!
            </p>
          )}
          <Button
            onPress={handleEdit}
            variant="bordered"
            className="font-semibold"
          >
            Edit
          </Button>
        </div>
      )}

      {error && (
        <p className="text-danger text-sm mt-3">{error}</p>
      )}
    </div>
  );
}
