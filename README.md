# Atis ERP Frontend

Vite + React + TypeScript single-page frontend for Atis ERP.

## Local development

```bash
pnpm install
pnpm run dev
```

## Build

```bash
pnpm run build
pnpm run preview
```

## Free GitHub Pages CI/CD

This repository includes GitHub Actions workflows for automatic CI and deployment:

- `.github/workflows/ci.yml`
  - Runs lint and build checks on pull requests, manual runs, and pushes to non-deployment branches.
- `.github/workflows/deploy-pages.yml`
  - Builds the app and deploys `dist` to GitHub Pages on every push to `main` or `master`.
  - Uses the existing `pnpm-lock.yaml` with `pnpm install --frozen-lockfile`.
  - Copies `dist/index.html` to `dist/404.html` so direct refreshes on SPA routes work on GitHub Pages.

### Required GitHub settings

After pushing the repo to GitHub:

1. Make the repository public if you want GitHub Pages on the free GitHub plan.
2. Go to `Settings` → `Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Push to `main` or `master`.
5. Open the workflow result in the `Actions` tab. The deployed URL will be shown in the deploy job.

### URL/base path behavior

The deploy workflow automatically sets the Vite base path:

- Repository named `<username>.github.io` → `/`
- Normal project repository, for example `atis-erp` → `/atis-erp/`

For a custom domain, add a repository variable:

1. Go to `Settings` → `Secrets and variables` → `Actions` → `Variables`.
2. Add `PAGES_BASE_PATH` with the value `/`.
3. Configure the custom domain from `Settings` → `Pages`.

## Notes

GitHub Pages serves static frontend files. This is suitable for the current Atis ERP frontend demo/admin UI, but it will not host a Node.js backend or private server-side API.
