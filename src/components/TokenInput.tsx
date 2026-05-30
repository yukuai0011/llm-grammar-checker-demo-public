import { useState } from "react";
import { Input, Card, CardContent } from "@heroui/react";

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
    <div className="mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
      >
        <span className="text-base font-semibold text-foreground">Settings</span>
        <span className="text-xs text-default-500">
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {expanded && (
        <Card className="mt-3" shadow="sm">
          <CardContent className="gap-3">
            <Input
              label="API Key"
              placeholder="sk-..."
              type="password"
              value={settings.apiKey}
              onChange={(e) => onChange({ ...settings, apiKey: e.target.value })}
            />
            <Input
              label="Base URL"
              placeholder="https://api.openai.com/v1"
              value={settings.baseUrl}
              onChange={(e) => onChange({ ...settings, baseUrl: e.target.value })}
            />
            <Input
              label="Model"
              placeholder="gpt-4o-mini"
              value={settings.model}
              onChange={(e) => onChange({ ...settings, model: e.target.value })}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
