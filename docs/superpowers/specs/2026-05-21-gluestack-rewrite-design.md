# GlueStack v2 + NativeWind Rewrite Design

## Overview

Rewrite the LLM Grammar Checker demo UI using GlueStack UI v2 components and NativeWind (Tailwind CSS) for styling. Replace all inline styles and StyleSheet.create with Tailwind classes. Replace raw RN components with GlueStack equivalents. Simplify the theme system by leveraging GlueStack's built-in theming.

## Tech Stack

- **GlueStack UI v2** — component library (Box, Text, Input, Button, VStack, HStack, Modal, etc.)
- **NativeWind v4** — Tailwind CSS for React Native
- **TypeScript** — type safety
- **Expo Router** — file-based routing (unchanged)
- **Bun** — runtime/package manager (unchanged)

## Architecture

### Provider Setup

`_layout.tsx` wraps the app with `GluestackUIProvider` for light/dark theme support. No manual theme switching needed — GlueStack handles it.

### Component Mapping

| Current | GlueStack v2 Replacement |
|---------|--------------------------|
| `View` | `Box` |
| `Text` | `Text` (GlueStack) |
| `TextInput` | `Input` + `InputField` |
| `Pressable` | `Button` |
| `ActivityIndicator` | `Spinner` |
| Flex layout styles | `VStack` / `HStack` with `gap` prop |
| Inline styles | NativeWind `className` props |

### Files Changed

| File | Action |
|------|--------|
| `src/app/_layout.tsx` | Add GluestackUIProvider |
| `src/app/index.tsx` | Use GlueStack layout components + NativeWind |
| `src/components/GrammarChecker.tsx` | Full rewrite with GlueStack + NativeWind |
| `src/components/TokenInput.tsx` | Rewrite with GlueStack Input |
| `src/components/UnderlinedText.tsx` | Partial rewrite (keep span logic for hover, add NativeWind) |
| `src/components/CorrectionPopup.tsx` | Rewrite with GlueStack Modal |
| `src/global.css` | Add Tailwind directives |
| `tailwind.config.ts` | Configure for NativeWind v4 |
| `src/constants/theme.ts` | Remove (replaced by GlueStack theming) |
| `src/components/themed-text.tsx` | Remove |
| `src/components/themed-view.tsx` | Remove |
| `src/app/explore.tsx` | Remove (boilerplate) |

### Files Unchanged

- `src/lib/llm.ts` — pure LLM API client logic
- `src/lib/parser.ts` — pure response parsing logic
- `src/hooks/use-color-scheme.ts` / `use-color-scheme.web.ts` — still used by GlueStack provider
- `.github/workflows/deploy.yml` — deployment unchanged

## Component Details

### GrammarChecker

- `VStack` for vertical layout with `gap`
- `Box` with `className="max-w-2xl w-full p-6"` for container
- `Button` for "Check Grammar" and "Edit" actions
- `Spinner` for loading state
- Error text uses `Text` with `className="text-error-600"`
- Success message uses `Text` with `className="text-success-600"`

### TokenInput

- Collapsible settings panel using `Pressable` + conditional render
- `Input` + `InputField` for API Key, Base URL, Model
- `InputSlot` for visibility toggle on API key field
- NativeWind classes for spacing and typography

### UnderlinedText

- Keep web-specific `<span>` rendering for hover behavior (GlueStack has no underline+hover primitive)
- Wrap in GlueStack `Box` with `className="p-3 border border-border-300 rounded-lg min-h-[120px]"`
- Inner `Text` with `className="text-base leading-6"`
- Hover highlight via inline style (dynamic state) + NativeWind for static styles

### CorrectionPopup

- Rewrite with GlueStack `Modal` or positioned `Box`
- `Text` with `className="text-success-400 font-semibold"` for corrected text
- `Text` with `className="text-typography-400 text-xs mt-1"` for reason

## Theme Simplification

- Remove manual `Colors` object, `useTheme` hook, `ThemedText`, `ThemedView`
- GlueStack's `GluestackUIProvider` provides light/dark theming automatically
- Custom colors (e.g., error blue `#2563eb`) configured in `tailwind.config.ts` as extended theme tokens
- The `global.css` file adds Tailwind base/components/utilities directives

## UX Flow (Unchanged)

1. User opens page → sees settings panel (collapsible) and text area
2. User enters API key, base URL, model in settings (persisted to localStorage)
3. User types/pastes text
4. User clicks "Check Grammar"
5. Text sent to LLM → corrections returned as JSON
6. Display mode shows text with red wavy underlines on errors
7. Hovering shows popup with correction + reason
8. "Edit" button returns to edit mode
