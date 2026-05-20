# LLM Grammar Checker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a demo web app that uses an LLM API to check grammar, showing corrections as underlines with hover popups, deployed to GitHub Pages.

**Architecture:** Expo Router single-page app with React Native Web. Client-side LLM API calls (OpenAI-compatible). Static web export deployed via GitHub Actions to GitHub Pages.

**Tech Stack:** Bun, Expo SDK 55, Expo Router, React Native Web, TypeScript, GitHub Actions

---

## File Structure

| File | Responsibility |
|------|---------------|
| `app/_layout.tsx` | Root layout, web head config |
| `app/index.tsx` | Home page, wires GrammarChecker component |
| `components/GrammarChecker.tsx` | Main orchestrator: edit/display modes, calls LLM, manages state |
| `components/TokenInput.tsx` | Settings panel: API key, base URL, model name (persisted to localStorage) |
| `components/UnderlinedText.tsx` | Renders text with wavy red underlines on corrected segments |
| `components/CorrectionPopup.tsx` | Hover popup showing corrected text and reason |
| `lib/llm.ts` | OpenAI-compatible chat completions client |
| `lib/parser.ts` | Parse LLM JSON response into typed Correction objects |
| `app.config.ts` | Expo config: web output static, baseUrl for GitHub Pages |
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript config |
| `.github/workflows/deploy.yml` | Build (any branch) + Deploy (main only) to GitHub Pages |

---

### Task 1: Scaffold Expo project with Bun

**Files:**
- Create: `package.json`
- Create: `app.config.ts`
- Create: `tsconfig.json`
- Create: `app/_layout.tsx`
- Create: `app/index.tsx`

- [ ] **Step 1: Initialize Expo project with Bun**

Run:
```bash
cd /c/Users/yukua/Downloads/llm-grammar-checker-demo-public
bun create expo --template default@sdk-55 .
```

If prompted about overwriting, accept. This creates `package.json`, `app.config.ts`, `tsconfig.json`, `app/_layout.tsx`, `app/index.tsx` and installs dependencies.

- [ ] **Step 2: Configure app.config.ts for GitHub Pages and static web export**

Replace `app.config.ts` with:

```typescript
import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "llm-grammar-checker",
  slug: "llm-grammar-checker",
  version: "1.0.0",
  web: {
    output: "static",
  },
  experiments: {
    baseUrl: "/llm-grammar-checker-demo-public",
  },
});
```

- [ ] **Step 3: Verify the scaffold builds**

Run:
```bash
bunx expo export --platform web
```

Expected: `dist/` folder created with `index.html`. May take a minute on first run.

- [ ] **Step 4: Commit scaffold**

```bash
git add -A
git commit -m "feat: scaffold Expo project with Bun and static web config"
```

---

### Task 2: LLM client library

**Files:**
- Create: `lib/llm.ts`

- [ ] **Step 1: Write the LLM client**

Create `lib/llm.ts`:

```typescript
export interface LLMConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chatCompletion(
  config: LLMConfig,
  messages: ChatMessage[]
): Promise<string> {
  const url = `${config.baseUrl.replace(/\/+$/, "")}/chat/completions`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: 0,
    }),
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error("Authentication failed. Check your API key.");
    }
    if (res.status === 429) {
      throw new Error("Rate limited. Please wait and try again.");
    }
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    throw new Error(
      "The LLM returned an unexpected format. Try again or try a different model."
    );
  }

  return content;
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/llm.ts
git commit -m "feat: add OpenAI-compatible LLM client"
```

---

### Task 3: Response parser

**Files:**
- Create: `lib/parser.ts`

- [ ] **Step 1: Write the parser**

Create `lib/parser.ts`:

```typescript
export interface Correction {
  original: string;
  corrected: string;
  reason: string;
  startIndex: number;
  endIndex: number;
}

const SYSTEM_PROMPT = `You are a grammar checker. Given text, find grammar, spelling, and punctuation errors.
Return a JSON array of corrections. Each correction must have:
- "original": the exact text fragment with the error
- "corrected": the corrected version
- "reason": a brief explanation

If no errors are found, return an empty array [].
Return ONLY the JSON array, no other text.`;

export function buildMessages(text: string): { role: "system" | "user"; content: string }[] {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: text },
  ];
}

export function parseResponse(text: string, originalText: string): Correction[] {
  let parsed: { original: string; corrected: string; reason: string }[];

  // Try to extract JSON from markdown code blocks if present
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();

  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error(
      "The LLM returned an unexpected format. Try again or try a different model."
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error(
      "The LLM returned an unexpected format. Try again or try a different model."
    );
  }

  const corrections: Correction[] = [];
  const usedRanges: [number, number][] = [];

  for (const item of parsed) {
    if (!item.original || !item.corrected || !item.reason) continue;
    if (item.original === item.corrected) continue;

    const startIndex = originalText.indexOf(item.original);
    if (startIndex === -1) continue;

    const endIndex = startIndex + item.original.length;

    // Skip overlapping corrections — take first match only
    const overlaps = usedRanges.some(
      ([s, e]) => startIndex < e && endIndex > s
    );
    if (overlaps) continue;

    usedRanges.push([startIndex, endIndex]);
    corrections.push({
      original: item.original,
      corrected: item.corrected,
      reason: item.reason,
      startIndex,
      endIndex,
    });
  }

  // Sort by position in text
  corrections.sort((a, b) => a.startIndex - b.startIndex);

  return corrections;
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/parser.ts
git commit -m "feat: add LLM response parser with overlap handling"
```

---

### Task 4: TokenInput component (settings panel)

**Files:**
- Create: `components/TokenInput.tsx`

- [ ] **Step 1: Write the TokenInput component**

Create `components/TokenInput.tsx`:

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add components/TokenInput.tsx
git commit -m "feat: add settings panel with API key, base URL, model config"
```

---

### Task 5: CorrectionPopup component

**Files:**
- Create: `components/CorrectionPopup.tsx`

- [ ] **Step 1: Write the CorrectionPopup component**

Create `components/CorrectionPopup.tsx`:

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add components/CorrectionPopup.tsx
git commit -m "feat: add correction hover popup component"
```

---

### Task 6: UnderlinedText component

**Files:**
- Create: `components/UnderlinedText.tsx`

- [ ] **Step 1: Write the UnderlinedText component**

Create `components/UnderlinedText.tsx`:

```typescript
import { useState } from "react";
import { View, Text } from "react-native";
import type { Correction } from "../lib/parser";
import { CorrectionPopup } from "./CorrectionPopup";

export function UnderlinedText({
  text,
  corrections,
}: {
  text: string;
  corrections: Correction[];
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Build segments: split text into corrected and normal parts
  const segments: { text: string; correction?: Correction }[] = [];
  let lastEnd = 0;

  for (const correction of corrections) {
    if (correction.startIndex > lastEnd) {
      segments.push({ text: text.slice(lastEnd, correction.startIndex) });
    }
    segments.push({ text: correction.original, correction });
    lastEnd = correction.endIndex;
  }
  if (lastEnd < text.length) {
    segments.push({ text: text.slice(lastEnd) });
  }

  const renderSegment = (
    seg: { text: string; correction?: Correction },
    idx: number
  ) => {
    const isHovered = hoveredIndex === idx;
    const hasCorrection = !!seg.correction;

    return (
      <span
        key={idx}
        onMouseEnter={() => hasCorrection && setHoveredIndex(idx)}
        onMouseLeave={() => setHoveredIndex(null)}
        style={{
          position: "relative",
          textDecoration: hasCorrection ? "wavy underline red" : "none",
          cursor: hasCorrection ? "pointer" : "default",
          backgroundColor: isHovered ? "rgba(255, 0, 0, 0.08)" : "transparent",
          whiteSpace: "pre-wrap",
        }}
      >
        {seg.text}
        {isHovered && seg.correction && (
          <CorrectionPopup correction={seg.correction} />
        )}
      </span>
    );
  };

  return (
    <View
      style={{
        padding: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        minHeight: 120,
      }}
    >
      <Text style={{ fontSize: 16, lineHeight: 24 }}>
        {segments.map(renderSegment)}
      </Text>
    </View>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/UnderlinedText.tsx
git commit -m "feat: add underlined text display with hover corrections"
```

---

### Task 7: GrammarChecker component (main orchestrator)

**Files:**
- Create: `components/GrammarChecker.tsx`

- [ ] **Step 1: Write the GrammarChecker component**

Create `components/GrammarChecker.tsx`:

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add components/GrammarChecker.tsx
git commit -m "feat: add GrammarChecker orchestrator with edit/display modes"
```

---

### Task 8: Wire up the home page

**Files:**
- Modify: `app/index.tsx`
- Modify: `app/_layout.tsx`

- [ ] **Step 1: Update app/_layout.tsx**

Replace `app/_layout.tsx` with:

```typescript
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
```

- [ ] **Step 2: Update app/index.tsx**

Replace `app/index.tsx` with:

```typescript
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
```

- [ ] **Step 3: Verify the app builds**

Run:
```bash
bunx expo export --platform web
```

Expected: `dist/` folder created successfully with `index.html`.

- [ ] **Step 4: Commit**

```bash
git add app/_layout.tsx app/index.tsx
git commit -m "feat: wire GrammarChecker into home page"
```

---

### Task 9: Suppress Chrome spell check

**Files:**
- No additional files needed

The `spellCheck={false}` and `autoCorrect={false}` props on the `TextInput` in `GrammarChecker.tsx` already suppress spell check at the input level. React Native Web translates these props to the correct HTML attributes (`spellcheck="false"`, `autocorrect="off"`, `autocomplete="off"`). No additional changes are needed.

- [ ] **Step 1: Verify spell check suppression in the built output**

After building, inspect `dist/index.html` or run the dev server and check that the textarea element has `spellcheck="false"` attribute.

---

### Task 10: GitHub Actions workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create the deploy workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches:
      - "**"

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2

      - run: bun install

      - run: bunx expo export --platform web

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions workflow for build and deploy to Pages"
```

---

### Task 11: Final verification

- [ ] **Step 1: Clean build from scratch**

Run:
```bash
rm -rf dist
bunx expo export --platform web
```

Expected: `dist/` folder with `index.html` and assets.

- [ ] **Step 2: Verify dist/index.html contains the app**

Run:
```bash
head -20 dist/index.html
```

Expected: HTML with script/link tags pointing to `/llm-grammar-checker-demo-public/...` assets.

- [ ] **Step 3: Verify workflow YAML is valid**

Run:
```bash
cat .github/workflows/deploy.yml
```

Expected: Valid YAML with build job (any branch) and deploy job (main only).

- [ ] **Step 4: Push to remote and verify Actions run**

```bash
git push origin yukuai0011/545-179-837-348-838
```

Then check GitHub Actions tab to verify the build job runs. The deploy job should be skipped since this is not the main branch.
