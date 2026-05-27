# gluestack-ui v3 Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the app from gluestack-ui v0.0.2 (NativeWind) to gluestack-ui v3 with `sx` prop styling.

**Architecture:** Single-screen Expo app. Replace all Tailwind/NativeWind class names with gluestack-ui v3 `sx` props and theme tokens. Delete custom UI component wrappers, use `@gluestack-ui/themed` directly. Remove NativeWind/Tailwind dependencies.

**Tech Stack:** Expo 55, React Native 0.83, gluestack-ui v3, bun

---

## File Structure

```
src/
  app/
    _layout.tsx         # Use GluestackUIProvider v3
    index.tsx           # Main screen
  components/
    GrammarChecker.tsx  # Rewrite with sx props
    TokenInput.tsx      # Rewrite with sx props
    CorrectionPopup.tsx # Rewrite with sx props
    UnderlinedText.tsx  # Keep as-is
    ui/                 # DELETE ALL (custom wrappers)
  lib/
    llm.ts              # Keep as-is
    parser.ts           # Keep as-is
  global.css            # Remove @tailwind directives
```

**Delete:**
- `src/components/ui/` (entire directory)
- `tailwind.config.js`
- `postcss.config.js`
- `nativewind-env.d.ts`
- `gluestack-ui.config.json`

**Modify:**
- `package.json`
- `src/app/_layout.tsx`
- `src/app/index.tsx`
- `src/components/GrammarChecker.tsx`
- `src/components/TokenInput.tsx`
- `src/components/CorrectionPopup.tsx`
- `src/global.css`
- `metro.config.js`

---

## Task 1: Update package.json — remove NativeWind, add gluestack-ui v3

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update dependencies**

Replace the `dependencies` section with:

```json
"dependencies": {
  "@gluestack-ui/themed": "^3.2.0",
  "@react-navigation/bottom-tabs": "^7.15.5",
  "@react-navigation/elements": "^2.9.10",
  "@react-navigation/native": "^7.1.33",
  "expo": "~55.0.25",
  "expo-constants": "~55.0.16",
  "expo-device": "~55.0.17",
  "expo-font": "~55.0.8",
  "expo-glass-effect": "~55.0.11",
  "expo-image": "~55.0.10",
  "expo-linking": "~55.0.15",
  "expo-router": "~55.0.15",
  "expo-splash-screen": "~55.0.21",
  "expo-status-bar": "~55.0.6",
  "expo-symbols": "~55.0.9",
  "expo-system-ui": "~55.0.18",
  "expo-web-browser": "~55.0.16",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "react-native": "0.83.6",
  "react-native-gesture-handler": "~2.30.0",
  "react-native-reanimated": "4.2.1",
  "react-native-safe-area-context": "~5.6.2",
  "react-native-screens": "~4.23.0",
  "react-native-web": "~0.21.0",
  "react-native-worklets": "0.7.4"
},
```

Remove from `devDependencies`: `autoprefixer`, `babel-plugin-module-resolver`

```json
"devDependencies": {
  "@types/react": "~19.2.2",
  "typescript": "~5.9.2"
}
```

- [ ] **Step 2: Run bun install to update lockfile**

Run: `cd "c:/Users/yukua/Downloads/llm-grammar-checker-demo-public" && bun install`
Expected: Installs new packages, updates bun.lock

- [ ] **Step 3: Commit**

```bash
git add package.json bun.lock && git commit -m "chore: replace nativewind with gluestack-ui v3"
```

---

## Task 2: Delete obsolete config and wrapper files

**Files:**
- Delete: `tailwind.config.js`
- Delete: `postcss.config.js`
- Delete: `nativewind-env.d.ts`
- Delete: `gluestack-ui.config.json`
- Delete: `src/components/ui/` (entire directory recursively)

- [ ] **Step 1: Delete files**

```bash
cd "c:/Users/yukua/Downloads/llm-grammar-checker-demo-public"
rm -f tailwind.config.js postcss.config.js nativewind-env.d.ts gluestack-ui.config.json
rm -rf src/components/ui
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "chore: remove nativewind config and custom ui wrappers"
```

---

## Task 3: Simplify metro.config.js

**Files:**
- Modify: `metro.config.js`

- [ ] **Step 1: Read current metro.config.js**

- [ ] **Step 2: Replace with simplified version**

```js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
```

- [ ] **Step 3: Commit**

```bash
git add metro.config.js && git commit -m "chore: remove nativewind from metro config"
```

---

## Task 4: Rewrite src/global.css

**Files:**
- Modify: `src/global.css`

- [ ] **Step 1: Replace content**

Replace the entire file content with:

```css
/* gluestack-ui v3 handles all styling via sx prop */
```

- [ ] **Step 2: Commit**

```bash
git add src/global.css && git commit -m "chore: remove tailwind directives from global.css"
```

---

## Task 5: Rewrite _layout.tsx with GluestackUIProvider v3

**Files:**
- Modify: `src/app/_layout.tsx`

- [ ] **Step 1: Read current file**

- [ ] **Step 2: Rewrite**

```tsx
import { Stack } from 'expo-router';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

export default function RootLayout() {
  return (
    <GluestackUIProvider config={config}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </GluestackUIProvider>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/_layout.tsx && git commit -m "feat: use gluestack-ui v3 GluestackUIProvider"
```

---

## Task 6: Rewrite GrammarChecker.tsx with sx props

**Files:**
- Modify: `src/components/GrammarChecker.tsx`

- [ ] **Step 1: Read current file** - Read the full current GrammarChecker.tsx

- [ ] **Step 2: Rewrite with gluestack-ui v3 imports and sx props**

See full file content in [docs/superpowers/specs/2026-05-27-gluestack-v3-upgrade-design.md](docs/superpowers/specs/2026-05-27-gluestack-v3-upgrade-design.md)

The component uses these imports from `@gluestack-ui/themed`:
- `Box`, `Text`, `Input`, `InputField`, `Button`, `ButtonText`, `VStack`, `HStack`, `Spinner`, `Pressable`

All `className` props are replaced with `sx` props using theme tokens like `$primary500`, `$background50`, `$border300`, `$error100`, `$success100`, `$typography600`, `$typography900`, etc.

- [ ] **Step 3: Commit**

```bash
git add src/components/GrammarChecker.tsx && git commit -m "feat: rewrite GrammarChecker with gluestack-ui v3 sx props"
```

---

## Task 7: Rewrite TokenInput.tsx with sx props

**Files:**
- Modify: `src/components/TokenInput.tsx`

- [ ] **Step 1: Read current file**

- [ ] **Step 2: Rewrite**

Replace imports from custom wrappers with `@gluestack-ui/themed`. Replace all `className` with `sx` props using theme tokens. Same pattern as GrammarChecker.

- [ ] **Step 3: Commit**

```bash
git add src/components/TokenInput.tsx && git commit -m "feat: rewrite TokenInput with gluestack-ui v3 sx props"
```

---

## Task 8: Rewrite CorrectionPopup.tsx with sx props

**Files:**
- Modify: `src/components/CorrectionPopup.tsx`

- [ ] **Step 1: Read current file**

- [ ] **Step 2: Rewrite**

Replace imports from custom wrappers with `@gluestack-ui/themed`. Replace all `className` with `sx` props.

- [ ] **Step 3: Commit**

```bash
git add src/components/CorrectionPopup.tsx && git commit -m "feat: rewrite CorrectionPopup with gluestack-ui v3 sx props"
```

---

## Task 9: Update app/index.tsx if needed

**Files:**
- Modify: `src/app/index.tsx`

- [ ] **Step 1: Read current file** to check for any className usage or custom UI imports

- [ ] **Step 2: Rewrite if needed**

If it imports from `@/components/ui/*`, update to `@gluestack-ui/themed`. Replace any `className` usage.

- [ ] **Step 3: Commit**

```bash
git add src/app/index.tsx && git commit -m "feat: update index.tsx for gluestack-ui v3"
```