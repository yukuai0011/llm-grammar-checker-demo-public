# LLM Grammar Checker - Design Spec

## Overview

A demo web app built with Expo Router, React Native Web, and Bun that uses an LLM API to check grammar. Users enter text, the LLM returns corrections as structured JSON, and corrections are shown as underlines with hover popups showing the correction and reason. Deployed to GitHub Pages via GitHub Actions.

## Tech Stack

- **Bun** as runtime/package manager
- **Expo Router** (file-based routing) with TypeScript
- **React Native Web** for web rendering
- **Static export** (`npx expo export:web`) → `dist/` folder
- **GitHub Actions** → deploy `dist/` to GitHub Pages

## Project Structure

```
├── app/                    # Expo Router pages
│   ├── _layout.tsx          # Root layout
│   └── index.tsx            # Home / grammar checker page
├── components/
│   ├── GrammarChecker.tsx    # Main checker component
│   ├── TokenInput.tsx        # API token + base URL + model config
│   ├── UnderlinedText.tsx    # Text display with hover corrections
│   └── CorrectionPopup.tsx    # Hover popup showing correction
├── lib/
│   ├── llm.ts              # LLM API client (OpenAI-compatible)
│   └── parser.ts           # Parse LLM JSON response into corrections
├── .github/
│   └── workflows/
│       └── deploy.yml       # Build & deploy to GitHub Pages
├── app.config.ts
├── package.json
└── tsconfig.json
```

## Architecture

Single-page app with one route for the grammar checker. All state managed with React hooks. API calls made client-side directly from the browser.

### Key Configuration

- `expo.basePath` set to `/llm-grammar-checker-demo-public` for GitHub Pages
- `spellCheck={false}` on text inputs to suppress Chrome spell check
- `autocomplete="off"` and `autocorrect="off"` on text areas

## UX Flow

1. User opens the page → sees a settings panel (collapsible) and a text area
2. User enters API key, base URL, and model name in settings panel (persisted to localStorage)
3. User types or pastes text into the text area
4. User clicks "Check Grammar" button
5. Text is sent to LLM with a prompt requesting structured JSON corrections
6. Text area switches to read-only display showing original text with red wavy underlines on grammar issues
7. Hovering over an underlined segment shows a popup with: corrected text and reason
8. User can click "Edit" to return to editing mode

### LLM Prompt Strategy

- Send user's text with system prompt instructing LLM to return JSON array of corrections
- Each correction: `{ "original": "teh", "corrected": "the", "reason": "Typo: wrong word order" }
- Prompt explicitly asks for ONLY grammar/spelling/punctuation issues, not style suggestions

### Correction Rendering

- `UnderlinedText` component splits original text into segments based on correction offsets
- Corrected segments get wavy red underline (CSS `text-decoration: wavy underline red`)
- On hover, `CorrectionPopup` appears positioned near the underlined text
- Popup shows corrected version and reason

## GitHub Actions & Deployment

### Workflow: `.github/workflows/deploy.yml`

**Job 1: Build (any branch push)**
- Triggers on `push` to any branch
- Installs Bun
- Runs `bun install`
- Runs `npx expo export:web` → produces `dist/`
- Uploads `dist/` as artifact

**Job 2: Deploy (main branch only)**
- Triggers on `push` to `main` only
- Depends on Build job
- Downloads `dist/` artifact
- Deploys to GitHub Pages using `actions/deploy-pages`
- Site served at `https://yukuai0011.github.io/llm-grammar-checker-demo-public/`

### GitHub Pages Config
- Source set to "GitHub Actions" in repo settings
- No secrets needed in CI — API key entered by user in browser at runtime

## Error Handling

### API Errors
- Network errors → "Could not reach the API. Check your base URL and network connection."
- 401/403 → "Authentication failed. Check your API key."
- Rate limiting (429) → "Rate limited. Please wait and try again."
- Malformed LLM response → "The LLM returned an unexpected format. Try again or try a different model."

### Edge Cases
- Empty text → disable "Check Grammar" button
- No corrections found → green "No grammar issues found!" message
- Overlapping corrections → take the first match and skip any overlapping subsequent corrections
- Very long text → no special handling for v1, send full text

### Loading State
- Disable button and show spinner while waiting for LLM response
- No streaming for v1 — wait for full response
