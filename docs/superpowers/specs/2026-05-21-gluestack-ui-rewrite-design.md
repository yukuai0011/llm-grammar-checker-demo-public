# GlueStack UI Rewrite Design

## Overview

Rewrite the LLM Grammar Checker demo's entire UI using GlueStack UI v2 with NativeWind v4 and Tailwind CSS. Replace all inline styles and `StyleSheet.create` with GlueStack components and Tailwind utility classes. Add proper dark mode support and tab navigation.

**Stack:** gluestack-ui v2 + NativeWind v4 + Tailwind CSS + Expo SDK 55

**Scope:** Full app — grammar checker, settings (new tab), tab navigation, dark mode. Web-only.

---

## Architecture & Dependencies

### New dependencies

- `nativewind` v4 — Tailwind CSS for React Native
- `tailwindcss` — CSS engine
- `@gluestack-ui/nativewind-utils` — GlueStack's NativeWind integration utilities
- `@gluestack-ui/overlay` — for Tooltip/Popover positioning
- `lucide-react-native` — icon library (GlueStack's default icon set)

### Config changes

- `tailwind.config.js` — GlueStack theme tokens (colors, fonts), NativeWind preset, content paths
- `babel.config.js` — Add `nativewind/babel` preset and `jsxImportSource: 'nativewind'`
- `metro.config.js` — Wrap with `withNativeWind`
- `src/global.css` — Add `@tailwind base/components/utilities` directives
- `src/gluestack-ui-provider/config.ts` — Light/dark theme config with CSS variables via `vars()`

### GlueStack components (copy-paste into `src/components/ui/`)

- `Box`, `VStack`, `HStack` — layout
- `Text`, `Heading` — typography
- `Button`, `ButtonText` — actions
- `Input`, `InputField`, `Textarea`, `TextareaInput` — form fields
- `Tabs`, `TabList`, `Tab`, `TabPanel`, `TabPanels` — tab navigation
- `Tooltip`, `TooltipContent`, `TooltipText` — correction popups
- `Badge`, `BadgeText` — correction count indicator
- `GluestackUIProvider` — theme context

---

## Navigation & Layout

### Root layout (`src/app/_layout.tsx`)

- Wrap everything in `GluestackUIProvider` with color mode support
- Import `global.css` for Tailwind
- Replace the current `Stack` navigator with a **Tabs** layout using GlueStack's `Tabs` component
- Tabs rendered directly in the layout — no separate route files for each tab (GlueStack Tabs is a component-based tab switcher, not a route navigator)

### Tab structure

- **Home tab** — Grammar checker (the main feature), rendered by `GrammarChecker` component
- **Settings tab** — API key, base URL, model configuration (moved out of the collapsible panel into its own tab for cleaner UX), rendered by `Settings` component

### Removed

- `src/app/explore.tsx` — scaffold boilerplate, not part of the app
- `src/components/app-tabs.tsx` / `app-tabs.web.tsx` — replaced by GlueStack Tabs
- Scaffold-only components (`animated-icon`, `web-badge`, `hint-row`, `themed-text`, `themed-view`, `collapsible`, `external-link`)

---

## Home Tab — Grammar Checker

### GrammarChecker component (rewritten with GlueStack)

- `VStack` container, centered, max width `max-w-3xl`, padding `p-6`

**Edit mode:**
- `Heading` "Grammar Checker" at top
- `Textarea` with `TextareaInput` for text input (replaces raw `TextInput`)
- `Button` with `ButtonText` "Check Grammar" — uses GlueStack's `action="primary"` variant
- Loading state: `Button` with `isLoading` prop, spinner built-in
- Error state: `Text` with `className="text-error-500"` for error messages

**Display mode:**
- `UnderlinedText` area showing corrections with wavy red underlines (web-only, using `<span>` inside a `Box`)
- `HStack` with two buttons: "Edit" (secondary variant) to go back, "Check Again" to re-check
- If no issues: `Badge` with `action="success"` showing "No grammar issues found!"

**Correction interaction:**
- Replace custom `CorrectionPopup` with GlueStack `Tooltip`
- Each underlined segment wrapped in `Tooltip` with `placement="top"`
- `TooltipContent` shows corrected text in green + reason in muted text

### UnderlinedText

- Stays largely the same internally (web `<span>` with wavy underline CSS)
- Wrapped in GlueStack `Box` and uses Tailwind classes for hover states instead of inline styles
- CSS variables for underline color and hover background to support dark mode

---

## Settings Tab

### Settings component (new file `src/components/Settings.tsx`)

- `VStack` container, centered, max width `max-w-3xl`, padding `p-6`
- `Heading` "Settings" at top
- Three `VStack` field groups, each with:
  - `Text` label (e.g. "API Key", "Base URL", "Model")
  - `Input` with `InputField` for Base URL and Model
  - `Input` with `InputField` and `type="password"` for API Key
- Values persisted to `localStorage` as before, auto-saved on change
- Default values: Base URL `https://api.openai.com/v1`, Model `gpt-4o-mini`
- `Text` helper below each field explaining what it's for (muted color)
- A "Reset to Defaults" `Button` with `variant="outline"` at the bottom

---

## Dark Mode

- `GluestackUIProvider` wraps the app and reads the system color scheme via `useColorScheme`
- Light/dark tokens defined in `src/gluestack-ui-provider/config.ts` using `vars()` from NativeWind
- All components use GlueStack's semantic color tokens (`background-0`, `text-700`, `primary-500`, etc.) via Tailwind classes — no hardcoded colors
- `UnderlinedText` uses CSS variables for the wavy underline color and hover background so they adapt to dark mode
- The `Tooltip` popup uses GlueStack's built-in dark mode styling automatically
- No manual toggle — follows system preference

---

## File Changes

### New files

- `tailwind.config.js` — Tailwind + GlueStack theme config
- `src/gluestack-ui-provider/config.ts` — Light/dark theme tokens
- `src/gluestack-ui-provider/index.tsx` — Provider component
- `src/components/ui/` — GlueStack copy-paste components (Box, VStack, HStack, Text, Heading, Button, Input, Textarea, Tabs, Tooltip, Badge)
- `src/components/Settings.tsx` — New settings tab component

### Modified files

- `src/app/_layout.tsx` — GluestackUIProvider wrapper, GlueStack Tabs layout (both tabs rendered here), global.css import
- `src/app/index.tsx` — Simplified to just render the layout's tab content (GrammarChecker)
- `src/components/GrammarChecker.tsx` — Full rewrite with GlueStack components
- `src/components/UnderlinedText.tsx` — Wrap in GlueStack Box, use Tailwind classes
- `babel.config.js` — Add NativeWind presets
- `metro.config.js` — Wrap with withNativeWind
- `src/global.css` — Add Tailwind directives

### Deleted files

- `src/app/explore.tsx` — Scaffold boilerplate
- `src/components/TokenInput.tsx` — Settings moved to dedicated tab
- `src/components/CorrectionPopup.tsx` — Replaced by GlueStack Tooltip
- `src/components/app-tabs.tsx` / `app-tabs.web.tsx` — Replaced by GlueStack Tabs
- `src/components/animated-icon.tsx` / `animated-icon.web.tsx` / `animated-icon.module.css` — Scaffold
- `src/components/web-badge.tsx` — Scaffold
- `src/components/hint-row.tsx` — Scaffold
- `src/components/themed-text.tsx` / `themed-view.tsx` — Replaced by GlueStack Text/Box
- `src/components/ui/collapsible.tsx` — Scaffold
- `src/components/external-link.tsx` — Scaffold
- `src/constants/theme.ts` — Replaced by GlueStack theme tokens
- `src/hooks/use-theme.ts` / `use-color-scheme.ts` / `use-color-scheme.web.ts` — Replaced by GlueStack/NativeWind

### Unchanged files

- `src/lib/llm.ts` — Business logic untouched
- `src/lib/parser.ts` — Business logic untouched
- `app.config.ts` — No changes needed
