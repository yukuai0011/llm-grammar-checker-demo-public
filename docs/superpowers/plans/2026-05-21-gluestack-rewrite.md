# GlueStack v2 + NativeWind Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the LLM Grammar Checker demo UI using GlueStack UI v2 components and NativeWind (Tailwind CSS) classes, replacing all inline styles and manual theming.

**Architecture:** GlueStack UI v2 uses copy-paste components generated via CLI into `src/components/ui/`. NativeWind v4 provides Tailwind CSS className support. The app wraps in `GluestackUIProvider` for theming. All inline styles and `StyleSheet.create` are replaced with Tailwind classes. The `lib/` layer (llm.ts, parser.ts) is untouched.

**Tech Stack:** GlueStack UI v2 (copy-paste components), NativeWind v4.2.4, Tailwind CSS v3, Expo Router v55, TypeScript, Bun

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/ui/gluestack-ui-provider.tsx` | Create (via CLI) | Theme provider wrapping the app |
| `src/components/ui/box.tsx` | Create (via CLI) | GlueStack Box component |
| `src/components/ui/text.tsx` | Create (via CLI) | GlueStack Text component |
| `src/components/ui/heading.tsx` | Create (via CLI) | GlueStack Heading component |
| `src/components/ui/input.tsx` | Create (via CLI) | GlueStack Input + InputField + InputSlot + InputIcon |
| `src/components/ui/button.tsx` | Create (via CLI) | GlueStack Button + ButtonText + ButtonSpinner |
| `src/components/ui/vstack.tsx` | Create (via CLI) | GlueStack VStack layout |
| `src/components/ui/hstack.tsx` | Create (via CLI) | GlueStack HStack layout |
| `src/components/ui/spinner.tsx` | Create (via CLI) | GlueStack Spinner loading indicator |
| `src/components/ui/pressable.tsx` | Create (via CLI) | GlueStack Pressable |
| `src/app/_layout.tsx` | Modify | Add GluestackUIProvider, import global.css |
| `src/app/index.tsx` | Modify | Use GlueStack layout components + NativeWind |
| `src/components/GrammarChecker.tsx` | Modify | Full rewrite with GlueStack + NativeWind |
| `src/components/TokenInput.tsx` | Modify | Rewrite with GlueStack Input |
| `src/components/UnderlinedText.tsx` | Modify | Partial rewrite (keep span logic, add NativeWind) |
| `src/components/CorrectionPopup.tsx` | Modify | Rewrite with GlueStack Box/Text + NativeWind |
| `src/global.css` | Modify | Add Tailwind directives |
| `tailwind.config.js` | Create | Tailwind config with GlueStack theme tokens |
| `metro.config.js` | Create | Metro config with NativeWind |
| `babel.config.js` | Create | Babel config with NativeWind preset |
| `postcss.config.js` | Create | PostCSS config for Tailwind |
| `src/constants/theme.ts` | Delete | Replaced by GlueStack theming |
| `src/components/themed-text.tsx` | Delete | Replaced by GlueStack Text |
| `src/components/themed-view.tsx` | Delete | Replaced by GlueStack Box |
| `src/hooks/use-theme.ts` | Delete | Replaced by GlueStack provider |
| `src/app/explore.tsx` | Delete | Boilerplate page, not needed |

---

### Task 1: Install and Configure GlueStack UI + NativeWind

**Files:**
- Create: `babel.config.js`
- Create: `metro.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Modify: `src/global.css`
- Modify: `package.json` (via bun add)

- [ ] **Step 1: Run gluestack-ui init to scaffold config files and install deps**

```bash
npx gluestack-ui init
```

This command creates `gluestack-ui.config.json`, `tailwind.config.js`, `metro.config.js`, `babel.config.js`, and installs NativeWind + Tailwind dependencies. Accept defaults when prompted.

- [ ] **Step 2: Verify babel.config.js has NativeWind presets**

The init command should produce:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};
```

If it doesn't match, update it to the above.

- [ ] **Step 3: Verify metro.config.js has NativeWind wrapper**

The init command should produce:

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './src/global.css' });
```

If it doesn't match, update it to the above.

- [ ] **Step 4: Verify tailwind.config.js has GlueStack theme tokens**

The init command should produce a config with `content` paths pointing to `./src/**`, `presets: [require('nativewind/preset')]`, and GlueStack color tokens (primary, secondary, error, success, warning, etc. using CSS variables). Verify the `content` array includes `'./src/**/**/*.{html,js,jsx,ts,tsx}'`.

- [ ] **Step 5: Create postcss.config.js**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: Update src/global.css with Tailwind directives**

Replace the entire file with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 7: Install any missing dependencies**

```bash
bun add nativewind tailwindcss autoprefixer
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: configure GlueStack UI v2 and NativeWind"
```

---

### Task 2: Add GlueStack UI Components via CLI

**Files:**
- Create: `src/components/ui/gluestack-ui-provider.tsx`
- Create: `src/components/ui/box.tsx`
- Create: `src/components/ui/text.tsx`
- Create: `src/components/ui/heading.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/vstack.tsx`
- Create: `src/components/ui/hstack.tsx`
- Create: `src/components/ui/spinner.tsx`
- Create: `src/components/ui/pressable.tsx`

- [ ] **Step 1: Add all needed GlueStack components**

```bash
npx gluestack-ui add box text heading input button vstack hstack spinner pressable
```

This generates copy-paste component files in `src/components/ui/` with NativeWind className support built in.

- [ ] **Step 2: Verify component files exist**

```bash
ls src/components/ui/
```

Expected output should include: `box.tsx`, `text.tsx`, `heading.tsx`, `input.tsx`, `button.tsx`, `vstack.tsx`, `hstack.tsx`, `spinner.tsx`, `pressable.tsx`, `gluestack-ui-provider.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add GlueStack UI v2 components"
```

---

### Task 3: Wire Up GluestackUIProvider in Layout

**Files:**
- Modify: `src/app/_layout.tsx`

- [ ] **Step 1: Update _layout.tsx to wrap with GluestackUIProvider**

Replace the entire file with:

```tsx
import { Stack } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </GluestackUIProvider>
  );
}
```

- [ ] **Step 2: Verify the app starts without errors**

```bash
npx expo start --web
```

Open the browser and confirm the app loads (it will still show the old UI, but no crashes).

- [ ] **Step 3: Commit**

```bash
git add src/app/_layout.tsx
git commit -m "feat: wrap app with GluestackUIProvider"
```

---

### Task 4: Rewrite TokenInput with GlueStack + NativeWind

**Files:**
- Modify: `src/components/TokenInput.tsx`

- [ ] **Step 1: Rewrite TokenInput.tsx**

Replace the entire file with:

```tsx
import { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/ui/input";
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
```

- [ ] **Step 2: Verify no import errors**

Check that the Input component file exports `InputField` — if it uses a separate import path, adjust accordingly. The CLI-generated `input.tsx` should export `Input`, `InputField`, `InputSlot`, `InputIcon`.

- [ ] **Step 3: Commit**

```bash
git add src/components/TokenInput.tsx
git commit -m "feat: rewrite TokenInput with GlueStack + NativeWind"
```

---

### Task 5: Rewrite CorrectionPopup with GlueStack + NativeWind

**Files:**
- Modify: `src/components/CorrectionPopup.tsx`

- [ ] **Step 1: Rewrite CorrectionPopup.tsx**

Replace the entire file with:

```tsx
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import type { Correction } from "../lib/parser";

export function CorrectionPopup({ correction }: { correction: Correction }) {
  return (
    <Box
      className="absolute bottom-full left-0 bg-background-900 rounded-lg p-2.5 mb-1.5 max-w-[320px] z-[100]"
    >
      <Text className="text-success-400 text-sm font-semibold">
        {correction.corrected}
      </Text>
      <Text className="text-typography-300 text-xs mt-1">
        {correction.reason}
      </Text>
    </Box>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CorrectionPopup.tsx
git commit -m "feat: rewrite CorrectionPopup with GlueStack + NativeWind"
```

---

### Task 6: Rewrite UnderlinedText with GlueStack + NativeWind

**Files:**
- Modify: `src/components/UnderlinedText.tsx`

- [ ] **Step 1: Rewrite UnderlinedText.tsx**

This component uses web-specific `<span>` for hover behavior. Keep that logic but wrap with GlueStack components and NativeWind classes.

Replace the entire file with:

```tsx
import { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
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
    <Box className="p-3 border border-border-300 rounded-lg min-h-[120px]">
      <Text className="text-base leading-6">
        {segments.map(renderSegment)}
      </Text>
    </Box>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/UnderlinedText.tsx
git commit -m "feat: rewrite UnderlinedText with GlueStack + NativeWind"
```

---

### Task 7: Rewrite GrammarChecker with GlueStack + NativeWind

**Files:**
- Modify: `src/components/GrammarChecker.tsx`

- [ ] **Step 1: Rewrite GrammarChecker.tsx**

Replace the entire file with:

```tsx
import { useState, useEffect, useCallback } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button";
import { ButtonSpinner } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Spinner } from "@/components/ui/spinner";
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
    <Box className="max-w-2xl w-full p-6">
      <Heading size="2xl" className="mb-1">
        Grammar Checker
      </Heading>
      <Text className="text-sm text-typography-500 mb-6">
        Paste your text and let an LLM find grammar issues.
      </Text>

      <TokenInput settings={settings} onChange={setSettings} />

      {mode === "edit" ? (
        <VStack className="gap-3">
          <Input variant="outline" size="md">
            <InputField
              value={text}
              onChangeText={setText}
              multiline
              placeholder="Type or paste your text here..."
              spellCheck={false}
              autoCorrect={false}
              className="min-h-[200px] text-base leading-6 text-top"
            />
          </Input>
          <Button
            onPress={handleCheck}
            isDisabled={loading || !text.trim()}
            className={loading || !text.trim() ? "bg-background-300" : ""}
          >
            {loading ? (
              <ButtonSpinner />
            ) : (
              <ButtonText>Check Grammar</ButtonText>
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
            variant="outline"
            action="secondary"
          >
            <ButtonText>Edit</ButtonText>
          </Button>
        </VStack>
      )}

      {error && (
        <Text className="text-error-600 text-sm mt-3">
          {error}
        </Text>
      )}
    </Box>
  );
}
```

- [ ] **Step 2: Verify the component renders without errors**

Start the dev server and check the grammar checker page loads with the new GlueStack components.

- [ ] **Step 3: Commit**

```bash
git add src/components/GrammarChecker.tsx
git commit -m "feat: rewrite GrammarChecker with GlueStack + NativeWind"
```

---

### Task 8: Rewrite Index Page with GlueStack + NativeWind

**Files:**
- Modify: `src/app/index.tsx`

- [ ] **Step 1: Rewrite index.tsx**

Replace the entire file with:

```tsx
import { Box } from "@/components/ui/box";
import { GrammarChecker } from "../components/GrammarChecker";

export default function Index() {
  return (
    <Box className="flex-1 bg-background-0 items-center pt-10">
      <GrammarChecker />
    </Box>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/index.tsx
git commit -m "feat: rewrite index page with GlueStack + NativeWind"
```

---

### Task 9: Clean Up Old Theme System and Unused Files

**Files:**
- Delete: `src/constants/theme.ts`
- Delete: `src/components/themed-text.tsx`
- Delete: `src/components/themed-view.tsx`
- Delete: `src/hooks/use-theme.ts`
- Delete: `src/app/explore.tsx`

- [ ] **Step 1: Delete unused files**

```bash
rm src/constants/theme.ts
rm src/components/themed-text.tsx
rm src/components/themed-view.tsx
rm src/hooks/use-theme.ts
rm src/app/explore.tsx
```

- [ ] **Step 2: Check for any remaining imports of deleted modules**

```bash
grep -r "from.*constants/theme" src/ || echo "No references to theme.ts"
grep -r "from.*themed-text" src/ || echo "No references to themed-text"
grep -r "from.*themed-view" src/ || echo "No references to themed-view"
grep -r "from.*use-theme" src/ || echo "No references to use-theme"
grep -r "from.*explore" src/ || echo "No references to explore"
```

If any references remain, update them to use GlueStack equivalents.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove old theme system and unused files"
```

---

### Task 10: Verify Full App Works End-to-End

**Files:** None (verification only)

- [ ] **Step 1: Start the dev server**

```bash
npx expo start --web
```

- [ ] **Step 2: Verify the grammar checker page loads**

Open the browser. Confirm:
- Page renders with GlueStack styled components
- Settings panel expands/collapses
- Text input accepts text
- "Check Grammar" button is disabled when text is empty
- No console errors related to missing imports or broken styles

- [ ] **Step 3: Test the grammar check flow**

1. Expand Settings, enter an API key
2. Type some text with grammar errors
3. Click "Check Grammar"
4. Verify loading spinner appears
5. Verify corrections display with wavy underlines
6. Hover over an underlined word — verify popup shows corrected text and reason
7. Click "Edit" — verify it returns to edit mode

- [ ] **Step 4: Verify static export works**

```bash
npx expo export:web
```

Confirm `dist/` is generated without errors.

- [ ] **Step 5: Commit any fixes found during testing**

If any issues were found and fixed:

```bash
git add -A
git commit -m "fix: address issues found during end-to-end testing"
```
