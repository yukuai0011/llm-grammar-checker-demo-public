# GlueStack UI Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the LLM Grammar Checker demo's entire UI with GlueStack UI v2, NativeWind v4, and Tailwind CSS, adding tab navigation and dark mode.

**Architecture:** Replace all inline styles/StyleSheet.create with GlueStack components and Tailwind utility classes. Use GlueStack Tabs for navigation (Home + Settings). Use GlueStack Tooltip for correction popups. Dark mode via GlueStack's theme system with CSS variables.

**Tech Stack:** Expo SDK 55, gluestack-ui v2, NativeWind v4, Tailwind CSS, lucide-react-native

---

## File Structure

### New files
- `tailwind.config.js` — Tailwind + GlueStack theme config
- `metro.config.js` — Metro wrapped with NativeWind
- `babel.config.js` — NativeWind babel presets (replaces current if any)
- `src/gluestack-ui-provider/config.ts` — Light/dark theme tokens
- `src/gluestack-ui-provider/index.tsx` — Provider component wrapping GluestackUIProvider
- `src/components/ui/box.tsx` — GlueStack Box
- `src/components/ui/vstack.tsx` — GlueStack VStack
- `src/components/ui/hstack.tsx` — GlueStack HStack
- `src/components/ui/text.tsx` — GlueStack Text
- `src/components/ui/heading.tsx` — GlueStack Heading
- `src/components/ui/button.tsx` — GlueStack Button
- `src/components/ui/input.tsx` — GlueStack Input
- `src/components/ui/textarea.tsx` — GlueStack Textarea
- `src/components/ui/tabs.tsx` — GlueStack Tabs
- `src/components/ui/tooltip.tsx` — GlueStack Tooltip
- `src/components/ui/badge.tsx` — GlueStack Badge
- `src/components/ui/center.tsx` — GlueStack Center
- `src/components/ui/icon.tsx` — GlueStack Icon wrapper (lucide)
- `src/components/Settings.tsx` — Settings tab component

### Modified files
- `src/global.css` — Add Tailwind directives
- `src/app/_layout.tsx` — GluestackUIProvider + Tabs layout
- `src/app/index.tsx` — Simplified, renders GrammarChecker
- `src/components/GrammarChecker.tsx` — Full rewrite with GlueStack
- `src/components/UnderlinedText.tsx` — Rewrite with GlueStack Box + Tooltip

### Deleted files
- `src/components/TokenInput.tsx` — Settings moved to dedicated tab
- `src/components/CorrectionPopup.tsx` — Replaced by GlueStack Tooltip
- `src/app/explore.tsx` — Scaffold boilerplate
- `src/components/app-tabs.tsx` / `app-tabs.web.tsx` — Replaced by GlueStack Tabs
- `src/components/animated-icon.tsx` / `animated-icon.web.tsx` / `animated-icon.module.css` — Scaffold
- `src/components/web-badge.tsx` — Scaffold
- `src/components/hint-row.tsx` — Scaffold
- `src/components/themed-text.tsx` / `themed-view.tsx` — Replaced by GlueStack
- `src/components/ui/collapsible.tsx` — Scaffold
- `src/components/external-link.tsx` — Scaffold
- `src/constants/theme.ts` — Replaced by GlueStack theme tokens
- `src/hooks/use-theme.ts` / `use-color-scheme.ts` / `use-color-scheme.web.ts` — Replaced

### Unchanged files
- `src/lib/llm.ts`
- `src/lib/parser.ts`
- `app.config.ts`

---

### Task 1: Install dependencies and configure NativeWind + Tailwind

**Files:**
- Create: `tailwind.config.js`
- Create: `metro.config.js`
- Create: `babel.config.js`
- Modify: `src/global.css`
- Modify: `package.json` (via install)

- [ ] **Step 1: Install NativeWind, Tailwind CSS, and GlueStack dependencies**

```bash
cd c:/Users/yukua/Downloads/llm-grammar-checker-demo-public
bun add nativewind tailwindcss@3.4.17 @gluestack-ui/nativewind-utils @gluestack-ui/overlay @gluestack-style/react react-native-css-interop lucide-react-native
```

- [ ] **Step 2: Create `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/**/*.{html,js,jsx,ts,tsx}",
    "./app/**/**/*.{html,js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontSize: {
        "2xs": "10px",
      },
      colors: {
        primary: {
          0: "var(--color-primary-0)",
          50: "var(--color-primary-50)",
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
          950: "var(--color-primary-950)",
        },
        secondary: {
          0: "var(--color-secondary-0)",
          50: "var(--color-secondary-50)",
          100: "var(--color-secondary-100)",
          200: "var(--color-secondary-200)",
          300: "var(--color-secondary-300)",
          400: "var(--color-secondary-400)",
          500: "var(--color-secondary-500)",
          600: "var(--color-secondary-600)",
          700: "var(--color-secondary-700)",
          800: "var(--color-secondary-800)",
          900: "var(--color-secondary-900)",
          950: "var(--color-secondary-950)",
        },
        background: {
          0: "var(--color-background-0)",
          50: "var(--color-background-50)",
          100: "var(--color-background-100)",
          200: "var(--color-background-200)",
          300: "var(--color-background-300)",
          400: "var(--color-background-400)",
          500: "var(--color-background-500)",
          600: "var(--color-background-600)",
          700: "var(--color-background-700)",
          800: "var(--color-background-800)",
          900: "var(--color-background-900)",
          950: "var(--color-background-950)",
        },
        error: {
          0: "var(--color-error-0)",
          50: "var(--color-error-50)",
          100: "var(--color-error-100)",
          200: "var(--color-error-200)",
          300: "var(--color-error-300)",
          400: "var(--color-error-400)",
          500: "var(--color-error-500)",
          600: "var(--color-error-600)",
          700: "var(--color-error-700)",
          800: "var(--color-error-800)",
          900: "var(--color-error-900)",
          950: "var(--color-error-950)",
        },
        success: {
          0: "var(--color-success-0)",
          50: "var(--color-success-50)",
          100: "var(--color-success-100)",
          200: "var(--color-success-200)",
          300: "var(--color-success-300)",
          400: "var(--color-success-400)",
          500: "var(--color-success-500)",
          600: "var(--color-success-600)",
          700: "var(--color-success-700)",
          800: "var(--color-success-800)",
          900: "var(--color-success-900)",
          950: "var(--color-success-950)",
        },
        warning: {
          0: "var(--color-warning-0)",
          50: "var(--color-warning-50)",
          100: "var(--color-warning-100)",
          200: "var(--color-warning-200)",
          300: "var(--color-warning-300)",
          400: "var(--color-warning-400)",
          500: "var(--color-warning-500)",
          600: "var(--color-warning-600)",
          700: "var(--color-warning-700)",
          800: "var(--color-warning-800)",
          900: "var(--color-warning-900)",
          950: "var(--color-warning-950)",
        },
        typography: {
          0: "var(--color-typography-0)",
          50: "var(--color-typography-50)",
          100: "var(--color-typography-100)",
          200: "var(--color-typography-200)",
          300: "var(--color-typography-300)",
          400: "var(--color-typography-400)",
          500: "var(--color-typography-500)",
          600: "var(--color-typography-600)",
          700: "var(--color-typography-700)",
          800: "var(--color-typography-800)",
          900: "var(--color-typography-900)",
          950: "var(--color-typography-950)",
        },
        outline: {
          0: "var(--color-outline-0)",
          50: "var(--color-outline-50)",
          100: "var(--color-outline-100)",
          200: "var(--color-outline-200)",
          300: "var(--color-outline-300)",
          400: "var(--color-outline-400)",
          500: "var(--color-outline-500)",
          600: "var(--color-outline-600)",
          700: "var(--color-outline-700)",
          800: "var(--color-outline-800)",
          900: "var(--color-outline-900)",
          950: "var(--color-outline-950)",
        },
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 3: Create `metro.config.js`**

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./src/global.css" });
```

- [ ] **Step 4: Create `babel.config.js`**

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

- [ ] **Step 5: Update `src/global.css`**

Replace the entire file with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-display:
    Spline Sans, Inter, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji,
    Segoe UI Symbol, Noto Color Emoji;
  --font-mono:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
  --font-rounded: 'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif;
  --font-serif: Georgia, 'Times New Roman', serif;
}
```

- [ ] **Step 6: Verify the dev server starts**

```bash
bunx expo start --web
```

Expected: Dev server starts without errors. The app may look broken (no GlueStack components yet), but no build/transform errors.

- [ ] **Step 7: Commit**

```bash
git add tailwind.config.js metro.config.js babel.config.js src/global.css package.json bun.lock
git commit -m "feat: add NativeWind v4 and Tailwind CSS configuration"
```

---

### Task 2: Set up GlueStack UI Provider with dark mode

**Files:**
- Create: `src/gluestack-ui-provider/config.ts`
- Create: `src/gluestack-ui-provider/index.tsx`

- [ ] **Step 1: Create `src/gluestack-ui-provider/config.ts`**

```ts
import { vars } from "nativewind";

export const config = {
  light: vars({
    "--color-primary-0": "#E5F4FF",
    "--color-primary-50": "#CCE9FF",
    "--color-primary-100": "#99D3FF",
    "--color-primary-200": "#66BDFF",
    "--color-primary-300": "#33A7FF",
    "--color-primary-400": "#0091FF",
    "--color-primary-500": "#0077CC",
    "--color-primary-600": "#0066B3",
    "--color-primary-700": "#005599",
    "--color-primary-800": "#004480",
    "--color-primary-900": "#003366",
    "--color-primary-950": "#001A33",
    "--color-secondary-0": "#F0F4FF",
    "--color-secondary-50": "#E1E8FF",
    "--color-secondary-100": "#C3D1FF",
    "--color-secondary-200": "#A5BAFF",
    "--color-secondary-300": "#87A3FF",
    "--color-secondary-400": "#698CFF",
    "--color-secondary-500": "#4B75FF",
    "--color-secondary-600": "#3F63E6",
    "--color-secondary-700": "#3351CC",
    "--color-secondary-800": "#2740B3",
    "--color-secondary-900": "#1B2E99",
    "--color-secondary-950": "#0D174F",
    "--color-background-0": "#FFFFFF",
    "--color-background-50": "#F9FAFB",
    "--color-background-100": "#F3F4F6",
    "--color-background-200": "#E5E7EB",
    "--color-background-300": "#D1D5DB",
    "--color-background-400": "#9CA3AF",
    "--color-background-500": "#6B7280",
    "--color-background-600": "#4B5563",
    "--color-background-700": "#374151",
    "--color-background-800": "#1F2937",
    "--color-background-900": "#111827",
    "--color-background-950": "#030712",
    "--color-error-0": "#FFF1F1",
    "--color-error-50": "#FFE0E0",
    "--color-error-100": "#FFC7C7",
    "--color-error-200": "#FFA3A3",
    "--color-error-300": "#FF7A7A",
    "--color-error-400": "#FF5252",
    "--color-error-500": "#DC2626",
    "--color-error-600": "#CC1F1F",
    "--color-error-700": "#B91C1C",
    "--color-error-800": "#991B1B",
    "--color-error-900": "#7F1D1D",
    "--color-error-950": "#450A0A",
    "--color-success-0": "#F0FFF4",
    "--color-success-50": "#DCFFE6",
    "--color-success-100": "#BBFFCF",
    "--color-success-200": "#8AFFAB",
    "--color-success-300": "#51FF7E",
    "--color-success-400": "#1AFF52",
    "--color-success-500": "#16A34A",
    "--color-success-600": "#13913F",
    "--color-success-700": "#0F7F35",
    "--color-success-800": "#0C6D2B",
    "--color-success-900": "#095B21",
    "--color-success-950": "#043613",
    "--color-warning-0": "#FFFBEB",
    "--color-warning-50": "#FFF3C4",
    "--color-warning-100": "#FFE588",
    "--color-warning-200": "#FFD54F",
    "--color-warning-300": "#FFC107",
    "--color-warning-400": "#FFAB00",
    "--color-warning-500": "#FF8F00",
    "--color-warning-600": "#E66500",
    "--color-warning-700": "#CC4E00",
    "--color-warning-800": "#B23A00",
    "--color-warning-900": "#992900",
    "--color-warning-950": "#4D1400",
    "--color-typography-0": "#FFFFFF",
    "--color-typography-50": "#F9FAFB",
    "--color-typography-100": "#F3F4F6",
    "--color-typography-200": "#E5E7EB",
    "--color-typography-300": "#D1D5DB",
    "--color-typography-400": "#9CA3AF",
    "--color-typography-500": "#6B7280",
    "--color-typography-600": "#4B5563",
    "--color-typography-700": "#374151",
    "--color-typography-800": "#1F2937",
    "--color-typography-900": "#111827",
    "--color-typography-950": "#030712",
    "--color-outline-0": "#FFFFFF",
    "--color-outline-50": "#F9FAFB",
    "--color-outline-100": "#F3F4F6",
    "--color-outline-200": "#E5E7EB",
    "--color-outline-300": "#D1D5DB",
    "--color-outline-400": "#9CA3AF",
    "--color-outline-500": "#6B7280",
    "--color-outline-600": "#4B5563",
    "--color-outline-700": "#374151",
    "--color-outline-800": "#1F2937",
    "--color-outline-900": "#111827",
    "--color-outline-950": "#030712",
  }),
  dark: vars({
    "--color-primary-0": "#001A33",
    "--color-primary-50": "#002E5C",
    "--color-primary-100": "#004280",
    "--color-primary-200": "#005599",
    "--color-primary-300": "#0066B3",
    "--color-primary-400": "#1A80CC",
    "--color-primary-500": "#3399FF",
    "--color-primary-600": "#66B3FF",
    "--color-primary-700": "#99CCFF",
    "--color-primary-800": "#CCE5FF",
    "--color-primary-900": "#E5F2FF",
    "--color-primary-950": "#F2F8FF",
    "--color-secondary-0": "#0D174F",
    "--color-secondary-50": "#1A2366",
    "--color-secondary-100": "#273080",
    "--color-secondary-200": "#343D99",
    "--color-secondary-300": "#414AB3",
    "--color-secondary-400": "#5561CC",
    "--color-secondary-500": "#6680FF",
    "--color-secondary-600": "#8599FF",
    "--color-secondary-700": "#A5B3FF",
    "--color-secondary-800": "#C4CCFF",
    "--color-secondary-900": "#E1E6FF",
    "--color-secondary-950": "#F0F2FF",
    "--color-background-0": "#0F172A",
    "--color-background-50": "#1E293B",
    "--color-background-100": "#273548",
    "--color-background-200": "#334155",
    "--color-background-300": "#475569",
    "--color-background-400": "#64748B",
    "--color-background-500": "#94A3B8",
    "--color-background-600": "#CBD5E1",
    "--color-background-700": "#E2E8F0",
    "--color-background-800": "#F1F5F9",
    "--color-background-900": "#F8FAFC",
    "--color-background-950": "#FFFFFF",
    "--color-error-0": "#450A0A",
    "--color-error-50": "#7F1D1D",
    "--color-error-100": "#991B1B",
    "--color-error-200": "#B91C1C",
    "--color-error-300": "#CC1F1F",
    "--color-error-400": "#DC2626",
    "--color-error-500": "#FF5252",
    "--color-error-600": "#FF7A7A",
    "--color-error-700": "#FFA3A3",
    "--color-error-800": "#FFC7C7",
    "--color-error-900": "#FFE0E0",
    "--color-error-950": "#FFF1F1",
    "--color-success-0": "#043613",
    "--color-success-50": "#095B21",
    "--color-success-100": "#0C6D2B",
    "--color-success-200": "#0F7F35",
    "--color-success-300": "#13913F",
    "--color-success-400": "#16A34A",
    "--color-success-500": "#1AFF52",
    "--color-success-600": "#51FF7E",
    "--color-success-700": "#8AFFAB",
    "--color-success-800": "#BBFFCF",
    "--color-success-900": "#DCFFE6",
    "--color-success-950": "#F0FFF4",
    "--color-warning-0": "#4D1400",
    "--color-warning-50": "#992900",
    "--color-warning-100": "#B23A00",
    "--color-warning-200": "#CC4E00",
    "--color-warning-300": "#E66500",
    "--color-warning-400": "#FF8F00",
    "--color-warning-500": "#FFC107",
    "--color-warning-600": "#FFD54F",
    "--color-warning-700": "#FFE588",
    "--color-warning-800": "#FFF3C4",
    "--color-warning-900": "#FFFBEB",
    "--color-warning-950": "#FFFFFF",
    "--color-typography-0": "#030712",
    "--color-typography-50": "#111827",
    "--color-typography-100": "#1F2937",
    "--color-typography-200": "#374151",
    "--color-typography-300": "#4B5563",
    "--color-typography-400": "#6B7280",
    "--color-typography-500": "#9CA3AF",
    "--color-typography-600": "#D1D5DB",
    "--color-typography-700": "#E5E7EB",
    "--color-typography-800": "#F3F4F6",
    "--color-typography-900": "#F9FAFB",
    "--color-typography-950": "#FFFFFF",
    "--color-outline-0": "#030712",
    "--color-outline-50": "#111827",
    "--color-outline-100": "#1F2937",
    "--color-outline-200": "#374151",
    "--color-outline-300": "#4B5563",
    "--color-outline-400": "#6B7280",
    "--color-outline-500": "#9CA3AF",
    "--color-outline-600": "#D1D5DB",
    "--color-outline-700": "#E5E7EB",
    "--color-outline-800": "#F3F4F6",
    "--color-outline-900": "#F9FAFB",
    "--color-outline-950": "#FFFFFF",
  }),
};
```

- [ ] **Step 2: Create `src/gluestack-ui-provider/index.tsx`**

```tsx
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
```

Note: The exact import path for `GluestackUIProvider` and `config` prop shape depends on the gluestack-ui v2 package structure. After running `npx gluestack-ui init`, verify the generated provider and adjust imports accordingly.

- [ ] **Step 3: Commit**

```bash
git add src/gluestack-ui-provider/
git commit -m "feat: add GlueStack UI provider with light/dark theme config"
```

---

### Task 3: Add GlueStack UI components via CLI

**Files:**
- Create: `src/components/ui/box.tsx`, `vstack.tsx`, `hstack.tsx`, `text.tsx`, `heading.tsx`, `button.tsx`, `input.tsx`, `textarea.tsx`, `tabs.tsx`, `tooltip.tsx`, `badge.tsx`, `center.tsx`, `icon.tsx`

- [ ] **Step 1: Run GlueStack UI init**

```bash
cd c:/Users/yukua/Downloads/llm-grammar-checker-demo-public
npx gluestack-ui@latest init --path src/components/ui
```

This creates `gluestack-ui.config.json` and sets up the component directory. Follow any interactive prompts — select Expo as the project type.

- [ ] **Step 2: Add required components**

```bash
npx gluestack-ui@latest add box vstack hstack text heading button input textarea tabs tooltip badge center icon
```

This copies the component source files into `src/components/ui/`. Each component is a self-contained file using NativeWind/Tailwind classes.

- [ ] **Step 3: Verify components were created**

```bash
ls src/components/ui/
```

Expected: `box.tsx`, `vstack.tsx`, `hstack.tsx`, `text.tsx`, `heading.tsx`, `button.tsx`, `input.tsx`, `textarea.tsx`, `tabs.tsx`, `tooltip.tsx`, `badge.tsx`, `center.tsx`, `icon.tsx` all present.

- [ ] **Step 4: Verify dev server still starts**

```bash
bunx expo start --web
```

Expected: No build errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/ gluestack-ui.config.json
git commit -m "feat: add GlueStack UI v2 components (box, vstack, hstack, text, heading, button, input, textarea, tabs, tooltip, badge, center, icon)"
```

---

### Task 4: Rewrite root layout with GlueStack Provider and Tabs

**Files:**
- Modify: `src/app/_layout.tsx`
- Modify: `src/app/index.tsx`

- [ ] **Step 1: Rewrite `src/app/_layout.tsx`**

```tsx
import "../src/global.css";
import { GluestackUIProvider } from "../src/gluestack-ui-provider";
import { Box } from "../src/components/ui/box";
import { Text } from "../src/components/ui/text";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "../src/components/ui/tabs";
import { GrammarChecker } from "../src/components/GrammarChecker";
import { Settings } from "../src/components/Settings";

export default function RootLayout() {
  return (
    <GluestackUIProvider>
      <Box className="flex-1 bg-background-0">
        <Tabs className="flex-1" defaultValue="home">
          <TabList className="bg-background-50 border-b border-outline-200">
            <Tab value="home">
              <Text className="text-typography-700 font-medium">Home</Text>
            </Tab>
            <Tab value="settings">
              <Text className="text-typography-700 font-medium">Settings</Text>
            </Tab>
          </TabList>
          <TabPanels className="flex-1">
            <TabPanel value="home" className="flex-1">
              <GrammarChecker />
            </TabPanel>
            <TabPanel value="settings" className="flex-1">
              <Settings />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </GluestackUIProvider>
  );
}
```

Note: The exact Tab/TabList/TabPanel API may differ based on the generated component. After Task 3, read the generated `tabs.tsx` to verify the API and adjust accordingly.

- [ ] **Step 2: Simplify `src/app/index.tsx`**

Since the layout now renders both tabs, the index route just needs to export a placeholder or redirect. With Expo Router file-based routing and the layout handling everything, simplify to:

```tsx
export { default } from "./_layout";
```

Wait — actually with Expo Router, `_layout.tsx` wraps the route files. The `index.tsx` is the content for the `/` route. Since we moved all content into the layout's Tabs, we can make `index.tsx` a simple redirect or empty component. The simplest approach: keep `index.tsx` as an empty component since the layout renders everything:

```tsx
export default function Index() {
  return null;
}
```

But this means the layout's Tabs render regardless. Actually, the correct Expo Router pattern is: `_layout.tsx` wraps route files, and each route file is a screen. Since we want Tabs to be the entire app, we should put the Tabs in `_layout.tsx` and have `index.tsx` just be a pass-through. The Tabs component manages its own state, so `index.tsx` can return null.

- [ ] **Step 3: Verify the app renders with tabs**

```bash
bunx expo start --web
```

Expected: App loads with "Home" and "Settings" tabs visible. Home tab shows the old GrammarChecker (still using inline styles). Settings tab shows nothing yet.

- [ ] **Step 4: Commit**

```bash
git add src/app/_layout.tsx src/app/index.tsx
git commit -m "feat: add GlueStack Provider and tab navigation to root layout"
```

---

### Task 5: Create Settings component

**Files:**
- Create: `src/components/Settings.tsx`

- [ ] **Step 1: Create `src/components/Settings.tsx`**

This replaces `TokenInput.tsx`. Move the `loadSettings`, `saveSettings`, and `LLMSettings` types here.

```tsx
import { useState, useEffect } from "react";
import { VStack } from "./ui/vstack";
import { Text } from "./ui/text";
import { Heading } from "./ui/heading";
import { Input, InputField } from "./ui/input";
import { Button, ButtonText } from "./ui/button";
import { Box } from "./ui/box";

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

export function Settings() {
  const [settings, setSettings] = useState<LLMSettings>(loadSettings);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const handleReset = () => {
    setSettings({ ...DEFAULTS });
  };

  return (
    <Box className="flex-1 items-center pt-10">
      <VStack className="w-full max-w-3xl px-6 gap-6">
        <Heading size="xl">Settings</Heading>
        <Text size="sm" className="text-typography-500">
          Configure your LLM API connection.
        </Text>

        <VStack className="gap-5">
          <VStack className="gap-1">
            <Text size="sm" className="text-typography-700 font-medium">
              API Key
            </Text>
            <Input>
              <InputField
                type="password"
                value={settings.apiKey}
                onChangeText={(apiKey) => setSettings({ ...settings, apiKey })}
                placeholder="sk-..."
              />
            </Input>
            <Text size="xs" className="text-typography-400">
              Your OpenAI-compatible API key. Stored locally in your browser.
            </Text>
          </VStack>

          <VStack className="gap-1">
            <Text size="sm" className="text-typography-700 font-medium">
              Base URL
            </Text>
            <Input>
              <InputField
                value={settings.baseUrl}
                onChangeText={(baseUrl) => setSettings({ ...settings, baseUrl })}
                placeholder="https://api.openai.com/v1"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Input>
            <Text size="xs" className="text-typography-400">
              The API endpoint. Change this for OpenAI-compatible providers.
            </Text>
          </VStack>

          <VStack className="gap-1">
            <Text size="sm" className="text-typography-700 font-medium">
              Model
            </Text>
            <Input>
              <InputField
                value={settings.model}
                onChangeText={(model) => setSettings({ ...settings, model })}
                placeholder="gpt-4o-mini"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Input>
            <Text size="xs" className="text-typography-400">
              The model to use for grammar checking.
            </Text>
          </VStack>
        </VStack>

        <Button variant="outline" onPress={handleReset} className="self-start">
          <ButtonText>Reset to Defaults</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
```

- [ ] **Step 2: Verify Settings tab renders**

```bash
bunx expo start --web
```

Expected: Click "Settings" tab — shows API Key, Base URL, Model fields with helper text and Reset button.

- [ ] **Step 3: Commit**

```bash
git add src/components/Settings.tsx
git commit -m "feat: add Settings component with GlueStack UI"
```

---

### Task 6: Rewrite GrammarChecker with GlueStack UI

**Files:**
- Modify: `src/components/GrammarChecker.tsx`

- [ ] **Step 1: Rewrite `src/components/GrammarChecker.tsx`**

```tsx
import { useState, useEffect, useCallback } from "react";
import { VStack } from "./ui/vstack";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import { Heading } from "./ui/heading";
import { Button, ButtonText, ButtonSpinner } from "./ui/button";
import { Textarea, TextareaInput } from "./ui/textarea";
import { Badge, BadgeText } from "./ui/badge";
import { Box } from "./ui/box";
import { UnderlinedText } from "./UnderlinedText";
import { loadSettings, saveSettings, type LLMSettings } from "./Settings";
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
    <Box className="flex-1 items-center pt-10">
      <VStack className="w-full max-w-3xl px-6 gap-4">
        <Heading size="2xl">Grammar Checker</Heading>
        <Text size="sm" className="text-typography-500">
          Paste your text and let an LLM find grammar issues.
        </Text>

        {mode === "edit" ? (
          <VStack className="gap-3">
            <Textarea className="min-h-[200px]">
              <TextareaInput
                value={text}
                onChangeText={setText}
                placeholder="Type or paste your text here..."
                spellCheck={false}
                autoCorrect={false}
                className="min-h-[200px] text-base leading-6"
              />
            </Textarea>
            <Button
              onPress={handleCheck}
              isDisabled={loading || !text.trim()}
              className="w-full"
              action="primary"
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
              <Badge action="success" variant="solid" className="self-center">
                <BadgeText>No grammar issues found!</BadgeText>
              </Badge>
            )}
            <HStack className="gap-3">
              <Button onPress={handleEdit} variant="outline" action="secondary">
                <ButtonText>Edit</ButtonText>
              </Button>
              <Button onPress={handleCheck} action="primary" isDisabled={loading}>
                {loading ? <ButtonSpinner /> : <ButtonText>Check Again</ButtonText>}
              </Button>
            </HStack>
          </VStack>
        )}

        {error && (
          <Text className="text-error-500 mt-3">{error}</Text>
        )}
      </VStack>
    </Box>
  );
}
```

- [ ] **Step 2: Verify GrammarChecker renders in edit mode**

```bash
bunx expo start --web
```

Expected: Home tab shows "Grammar Checker" heading, textarea, and "Check Grammar" button. All styled with GlueStack theme colors.

- [ ] **Step 3: Commit**

```bash
git add src/components/GrammarChecker.tsx
git commit -m "feat: rewrite GrammarChecker with GlueStack UI components"
```

---

### Task 7: Rewrite UnderlinedText with GlueStack Tooltip

**Files:**
- Modify: `src/components/UnderlinedText.tsx`

- [ ] **Step 1: Rewrite `src/components/UnderlinedText.tsx`**

Replace the custom `CorrectionPopup` with GlueStack `Tooltip`. Keep the web-only `<span>` approach for wavy underlines but wrap corrected segments in Tooltip.

```tsx
import { useState } from "react";
import { Box } from "./ui/box";
import { Text } from "./ui/text";
import { Tooltip, TooltipContent, TooltipText } from "./ui/tooltip";
import type { Correction } from "../lib/parser";

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

    if (!hasCorrection) {
      return (
        <span key={idx} style={{ whiteSpace: "pre-wrap" }}>
          {seg.text}
        </span>
      );
    }

    return (
      <Tooltip
        key={idx}
        placement="top"
        isOpen={isHovered ?? undefined}
        trigger={(triggerProps) => (
          <span
            {...triggerProps}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              textDecoration: "wavy underline red",
              cursor: "pointer",
              backgroundColor: isHovered ? "rgba(255, 0, 0, 0.08)" : "transparent",
              whiteSpace: "pre-wrap",
            }}
          >
            {seg.text}
          </span>
        )}
      >
        <TooltipContent>
          <TooltipText className="text-success-400 font-semibold">
            {seg.correction!.corrected}
          </TooltipText>
          <TooltipText className="text-typography-300 text-xs mt-1">
            {seg.correction!.reason}
          </TooltipText>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <Box className="p-3 border border-outline-300 rounded-lg min-h-[120px]">
      <Text className="text-base leading-6">
        {segments.map(renderSegment)}
      </Text>
    </Box>
  );
}
```

Note: The Tooltip `trigger` prop API may vary based on the generated component. After Task 3, read the generated `tooltip.tsx` to verify the exact API and adjust the trigger pattern accordingly. If the generated Tooltip doesn't use a `trigger` render prop, adapt to use the component's actual API (e.g., `TooltipTrigger` wrapper component).

- [ ] **Step 2: Verify corrections display with tooltips**

```bash
bunx expo start --web
```

Test: Enter text with a grammar error, click "Check Grammar", hover over a red-underlined correction. Expected: Tooltip appears showing the corrected text and reason.

- [ ] **Step 3: Commit**

```bash
git add src/components/UnderlinedText.tsx
git commit -m "feat: rewrite UnderlinedText with GlueStack Tooltip"
```

---

### Task 8: Delete scaffold files and unused components

**Files:**
- Delete: `src/components/TokenInput.tsx`
- Delete: `src/components/CorrectionPopup.tsx`
- Delete: `src/app/explore.tsx`
- Delete: `src/components/app-tabs.tsx`
- Delete: `src/components/app-tabs.web.tsx`
- Delete: `src/components/animated-icon.tsx`
- Delete: `src/components/animated-icon.web.tsx`
- Delete: `src/components/animated-icon.module.css`
- Delete: `src/components/web-badge.tsx`
- Delete: `src/components/hint-row.tsx`
- Delete: `src/components/themed-text.tsx`
- Delete: `src/components/themed-view.tsx`
- Delete: `src/components/ui/collapsible.tsx`
- Delete: `src/components/external-link.tsx`
- Delete: `src/constants/theme.ts`
- Delete: `src/hooks/use-theme.ts`
- Delete: `src/hooks/use-color-scheme.ts`
- Delete: `src/hooks/use-color-scheme.web.ts`

- [ ] **Step 1: Delete all scaffold and unused files**

```bash
cd c:/Users/yukua/Downloads/llm-grammar-checker-demo-public
rm src/components/TokenInput.tsx
rm src/components/CorrectionPopup.tsx
rm src/app/explore.tsx
rm src/components/app-tabs.tsx
rm src/components/app-tabs.web.tsx
rm src/components/animated-icon.tsx
rm src/components/animated-icon.web.tsx
rm src/components/animated-icon.module.css
rm src/components/web-badge.tsx
rm src/components/hint-row.tsx
rm src/components/themed-text.tsx
rm src/components/themed-view.tsx
rm src/components/ui/collapsible.tsx
rm src/components/external-link.tsx
rm src/constants/theme.ts
rm src/hooks/use-theme.ts
rm src/hooks/use-color-scheme.ts
rm src/hooks/use-color-scheme.web.ts
```

- [ ] **Step 2: Verify no remaining imports reference deleted files**

```bash
grep -r "TokenInput\|CorrectionPopup\|app-tabs\|animated-icon\|web-badge\|hint-row\|themed-text\|themed-view\|collapsible\|external-link\|use-theme\|use-color-scheme\|@/constants/theme" src/ --include="*.tsx" --include="*.ts" -l
```

Expected: No results. If any files still import deleted modules, update those imports.

- [ ] **Step 3: Verify the app still builds and runs**

```bash
bunx expo start --web
```

Expected: App loads with Home and Settings tabs. Grammar checker works. No console errors about missing modules.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove scaffold and unused components replaced by GlueStack UI"
```

---

### Task 9: Verify dark mode and final polish

**Files:**
- Possibly modify: `src/components/UnderlinedText.tsx` (dark mode fixes)
- Possibly modify: `src/gluestack-ui-provider/config.ts` (color adjustments)

- [ ] **Step 1: Test dark mode**

Switch your OS/browser to dark mode. Refresh the app.

Expected: Background uses `background-0` dark token, text uses `typography-900` dark token, tabs and inputs adapt. The wavy red underlines should still be visible against the dark background.

- [ ] **Step 2: Fix any dark mode issues**

If the wavy underline color or hover background doesn't work well in dark mode, update `UnderlinedText.tsx` to use CSS variables or conditional styling. For example, replace hardcoded `red` with `var(--color-error-500)` and `rgba(255, 0, 0, 0.08)` with `rgba(var(--color-error-500-rgb), 0.08)` if needed.

- [ ] **Step 3: Test full grammar check flow**

1. Go to Settings tab, enter an API key
2. Go to Home tab, paste text with a grammar error
3. Click "Check Grammar"
4. Verify corrections appear with red wavy underlines
5. Hover over a correction — tooltip should show corrected text and reason
6. Click "Edit" — returns to edit mode
7. Click "Check Again" — re-checks the text

- [ ] **Step 4: Verify web build for deployment**

```bash
bunx expo export --platform web
```

Expected: Build completes without errors. Output in `dist/` directory.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: dark mode adjustments and final polish"
```

---

## Self-Review

**1. Spec coverage:**
- Architecture & Dependencies → Task 1, 2, 3
- Navigation & Layout → Task 4
- Home Tab / Grammar Checker → Task 6, 7
- Settings Tab → Task 5
- Dark Mode → Task 2 (provider config), Task 9 (verification)
- File Changes (new/modified/deleted) → Tasks 1-8

**2. Placeholder scan:** No TBDs, TODOs, or "implement later" patterns. All steps contain actual code or commands.

**3. Type consistency:**
- `LLMSettings` type is defined in `Settings.tsx` (Task 5) and imported by `GrammarChecker.tsx` (Task 6) — consistent.
- `Correction` type from `parser.ts` used in `UnderlinedText.tsx` (Task 7) — consistent with existing code.
- `loadSettings`/`saveSettings` moved from `TokenInput.tsx` to `Settings.tsx` — imports updated in Task 6.
