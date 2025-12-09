# myfave-poc

Proof-of-concept Next.js 16 application built with React 19, Tailwind CSS, and pnpm.  
The repo includes Vitest unit tests and Playwright E2E coverage out of the box.

## Prerequisites

- Node.js `22.20.0` (managed via `nvm` recommended; `.nvmrc` provided)
- pnpm `>=10` (`npm install -g pnpm@10`)
- direnv (optional, but the setup script will configure it if present)

## Quick Start

```sh
git clone git@github.com:codelegger/myfave.git
cd myfave
./setup.sh
pnpm dev
```

Open <http://localhost:3000> in your browser. Press `Ctrl+C` to stop the dev server.

### What `./setup.sh` does

1. Ensures `direnv`, `nvm`, Node `22.20.0`, and pnpm `>=10`.
2. Installs all project dependencies via `pnpm install`.
3. Installs Playwright browsers for E2E tests.
4. Configures Husky Git hooks (when run inside a Git repo).

If the script updates your shell startup file, re-source it (`source ~/.zshrc`) or open a new terminal.

## Available npm Scripts

- `pnpm dev` – start the Next.js dev server.
- `pnpm build` & `pnpm start` – create and serve the production build.
- `pnpm test` – run Vitest unit tests.
- `pnpm test:e2e` – execute Playwright end-to-end tests (requires browsers from setup step).
- `pnpm lint` – run ESLint.
- `pnpm format` – apply Prettier formatting.

## Deployment Options

- **Vercel (recommended):** Next.js 16 + App Router deploys seamlessly. Connect the GitHub repo and Vercel will handle builds and previews automatically.
- **GitHub Pages:** Possible only after generating a fully static export (`next export`) and serving from the `out/` directory. Because this project uses App Router features (including dynamic routes), you would need to pre-render all dynamic paths or refactor to static-only pages before Pages deployment.
- **Docker/Other hosts:** Generate a production build (`pnpm build`) and run `pnpm start` behind your own process manager or container.

For shared testing, Vercel preview deployments via pull requests give the quickest turn-around.

## Further Reading

- [Architecture & Growth Guide](docs/architecture.md) – rationale for the current structure, route map, and roadmap for scaling this MyFave clone.

