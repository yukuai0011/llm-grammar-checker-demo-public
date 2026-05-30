# LLM Grammar Checker

An LLM-powered grammar checker web app built with React, HeroUI, and Bun.

Paste text, click **Check Grammar**, and an LLM highlights errors with red wavy underlines. Hover to see the correction and explanation.

## Stack

- **React 19** + **HeroUI v3** (component library)
- **Tailwind CSS v4** (styling)
- **Bun** (bundler + runtime)
- Deployed as a static site to **GitHub Pages**

## Getting Started

```bash
bun install
bun run dev
```

Open http://localhost:3000.

## Build

```bash
bun run build
```

Output goes to `dist/`.

## Deploy

Push to `main`. GitHub Actions builds and deploys to GitHub Pages automatically.

## License

MIT
