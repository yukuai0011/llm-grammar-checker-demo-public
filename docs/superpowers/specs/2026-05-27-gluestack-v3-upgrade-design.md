---
name: gluestack-v3-upgrade
description: Upgrade from gluestack-ui v0.0.2 (NativeWind) to gluestack-ui v3 with sx prop styling
metadata:
  type: design
---

# gluestack-ui v3 Upgrade Design

## Context

Current app uses gluestack-ui v0.0.2 with `@gluestack-ui/nativewind`, leveraging NativeWind (Tailwind CSS) for styling via class names. The goal is to upgrade to gluestack-ui v3, which uses a different styling paradigm based on the `sx` prop and theme tokens.

## Design

### Approach

- **Pure gluestack-ui v3 approach** — Use `sx` prop with gluestack tokens (`$primary500`, `$border300`, `$spacing`, etc.)
- Remove NativeWind/Tailwind dependency entirely — no more class names
- Use components directly from `@gluestack-ui/themed`
- Delete custom thin-wrapper components in `src/components/ui/`

### Architecture

Single-screen grammar checker app. Same functionality, rewritten styling:

1. **Text input area** — user enters text to check
2. **Check button** — sends text to LLM API
3. **Corrections display** — shows corrected text with underlined errors
4. **Settings panel** — collapsible, configures API key / base URL / model

### Component Styling Pattern (gluestack-ui v3 sx prop)

```jsx
// Theme tokens: $colorName, $sizeName, $spacingName, $borderRadiusName
<Box sx={{ bg: '$background100', p: '$4', borderRadius: '$lg' }}>
  <Text sx={{ color: '$typography700', fontSize: '$md', fontWeight: '$semibold' }}>
    Hello
  </Text>
</Box>
```

Key theme tokens from default config:
- **Colors**: `$primary500`, `$background100`, `$typography700`, `$border300`, `$error500`, `$success500`
- **Spacing**: `$1`–`$12` (4px–48px), `$4` = 16px
- **Border radius**: `$sm` (4px), `$md` (6px), `$lg` (8px), `$xl` (12px)
- **Font size**: `$xs` (10px), `$sm` (12px), `$md` (14px), `$lg` (16px), `$xl` (20px), `$2xl` (24px)
- **Font weight**: `$normal`, `$medium`, `$semibold`, `$bold`

### File Changes

| File | Action |
|------|--------|
| `src/components/ui/*` (all custom wrappers) | **DELETE** — no longer needed |
| `src/components/GrammarChecker.tsx` | Rewrite with gluestack `sx` props |
| `src/components/TokenInput.tsx` | Rewrite with gluestack `sx` props |
| `src/components/CorrectionPopup.tsx` | Rewrite with gluestack `sx` props |
| `src/components/UnderlinedText.tsx` | Keep — unchanged |
| `src/app/_layout.tsx` | Use `GluestackUIProvider` from v3 |
| `src/app/index.tsx` | Minor adjustments if needed |
| `src/global.css` | Remove `@tailwind` directives |
| `tailwind.config.js` | **DELETE** |
| `postcss.config.js` | **DELETE** |
| `metro.config.js` | Simplify (remove nativewind if present) |
| `nativewind-env.d.ts` | **DELETE** |
| `gluestack-ui.config.json` | **DELETE** (v3 uses code config) |
| `package.json` | Update gluestack-ui to v3, remove nativewind |

### package.json Dependencies

**Remove:**
- `nativewind`
- `@tailwindcss/typography` (if present)

**Update/add:**
- `@gluestack-ui/themed` v3
- `@gluestack-ui/config` v3 (optional default config)

**Keep:**
- `react-native` / `expo`
- `llm grammar checker logic` (lib/llm.ts, lib/parser.ts)

## Component Rewrite Reference

### GrammarChecker.tsx

```tsx
import { Box } from '@gluestack-ui/themed';
import { Text } from '@gluestack-ui/themed';
import { Input, InputField } from '@gluestack-ui/themed';
import { Button, ButtonText } from '@gluestack-ui/themed';
import { VStack } from '@gluestack-ui/themed';
import { HStack } from '@gluestack-ui/themed';
import { Spinner } from '@gluestack-ui/themed';
// ... rest imports
```

### TokenInput.tsx

```tsx
<Box sx={{ mb: '$4' }}>
  <Pressable onPress={() => setExpanded(!expanded)}>
    <HStack sx={{ alignItems: 'center', gap: '$2' }}>
      <Text sx={{ fontSize: '$base', fontWeight: '$semibold' }}>Settings</Text>
      <Text sx={{ fontSize: '$xs', color: '$typography500' }}>
        {expanded ? '▲' : '▼'}
      </Text>
    </HStack>
  </Pressable>

  {expanded && (
    <VStack sx={{ mt: '$3', gap: '$2.5' }}>
      <Box>
        <Text sx={{ fontSize: '$sm', mb: '$1', color: '$typography600' }}>
          API Key
        </Text>
        <Input sx={{ borderRadius: '$lg', borderWidth: 1, borderColor: '$border300', h: 40, overflow: 'hidden' }}>
          <InputField
            value={settings.apiKey}
            onChangeText={(apiKey) => onChange({ ...settings, apiKey })}
            placeholder="sk-..."
            secureTextEntry
            sx={{ flex: 1, px: '$3', color: '$typography900' }}
          />
        </Input>
      </Box>
      // ... baseUrl and model fields
    </VStack>
  )}
</Box>
```

### _layout.tsx

```tsx
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <Slot />
    </GluestackUIProvider>
  );
}
```

## Success Criteria

1. App renders without Tailwind/NativeWind — all styling via gluestack-ui v3 sx props
2. All existing functionality works: text input, grammar check, correction display, settings persistence
3. No `className` props anywhere in components
4. Build succeeds on both Expo and native targets