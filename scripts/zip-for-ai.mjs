#!/usr/bin/env node

import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (process.platform !== "win32") {
  console.error("This script is Windows-only.");
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script location:
 * project-root/scripts/zip-for-ai-win.mjs
 */
const projectRoot = path.resolve(__dirname, "..");
const projectName = path.basename(projectRoot).replace(/[^\w.-]+/g, "-");

const outputDir = path.join(projectRoot, "_ai_zip");

const timestamp = new Date().toISOString().replace(/[:.]/g, "-").replace("T", "_").slice(0, 19);

const stagingDir = path.join(outputDir, `_staging-${timestamp}`);
const outputZipPath = path.join(outputDir, `${projectName}-ai-context-${timestamp}.zip`);

/**
 * Change this list yourself.
 */
const EXCLUDED_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  "out",
  ".git",
  ".history",
  ".cache",
  ".vite",
  ".next",
  ".turbo",
  "coverage",
  "storybook-static",
  "_ai_zip",
]);

const EXCLUDED_FILES = new Set([
  ".env",
  ".env.local",
  ".env.development.local",
  ".env.production.local",
  ".env.test.local",
  "npm-debug.log",
  "yarn-debug.log",
  "yarn-error.log",
  "pnpm-debug.log",
]);

const EXCLUDED_EXTENSIONS = new Set([".zip", ".7z", ".rar", ".tar", ".gz", ".tgz"]);

/**
 * Optional.
 * Example:
 * const MAX_FILE_SIZE_MB = 5;
 */
const MAX_FILE_SIZE_MB = null;

const SKIP_SYMLINKS = true;

function toZipPath(filePath) {
  return filePath.split(path.sep).join("/");
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / 1024 ** index;

  return `${value.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

async function pathExists(filePath) {
  try {
    await fsp.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonIfExists(filePath) {
  try {
    const raw = await fsp.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filePath);

    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

function shouldExcludeRelativePath(relativePath, dirent, stat) {
  const normalized = toZipPath(relativePath);
  const parts = normalized.split("/");
  const baseName = parts.at(-1);
  const ext = path.extname(baseName).toLowerCase();

  if (SKIP_SYMLINKS && dirent.isSymbolicLink()) {
    return true;
  }

  if (parts.some((part) => EXCLUDED_DIRS.has(part))) {
    return true;
  }

  if (EXCLUDED_FILES.has(baseName)) {
    return true;
  }

  if (EXCLUDED_EXTENSIONS.has(ext)) {
    return true;
  }

  if (MAX_FILE_SIZE_MB !== null && stat?.isFile() && stat.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return true;
  }

  return false;
}

async function collectFiles(currentDir) {
  const result = [];
  const entries = await fsp.readdir(currentDir, { withFileTypes: true });

  entries.sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    const absolutePath = path.join(currentDir, entry.name);
    const relativePath = path.relative(projectRoot, absolutePath);
    const stat = await fsp.lstat(absolutePath);

    if (shouldExcludeRelativePath(relativePath, entry, stat)) {
      continue;
    }

    if (entry.isDirectory()) {
      result.push(...(await collectFiles(absolutePath)));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    result.push({
      absolutePath,
      relativePath: toZipPath(relativePath),
      size: stat.size,
      modifiedAt: stat.mtime.toISOString(),
    });
  }

  return result;
}

function inferPackageManager() {
  if (fs.existsSync(path.join(projectRoot, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(projectRoot, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(projectRoot, "package-lock.json"))) return "npm";
  if (fs.existsSync(path.join(projectRoot, "bun.lockb"))) return "bun";
  if (fs.existsSync(path.join(projectRoot, "bun.lock"))) return "bun";

  return "unknown";
}

function detectStack(packageJson) {
  const deps = {
    ...packageJson?.dependencies,
    ...packageJson?.devDependencies,
  };

  const stack = [];

  if (deps.vite) stack.push("Vite");
  if (deps.react) stack.push("React");
  if (deps.typescript) stack.push("TypeScript");
  if (deps.tailwindcss) stack.push("Tailwind CSS");
  if (deps["@tanstack/react-router"]) stack.push("TanStack Router");
  if (deps["@tanstack/react-query"]) stack.push("TanStack Query");
  if (deps["@tanstack/react-form"]) stack.push("TanStack Form");
  if (deps.zustand) stack.push("Zustand");
  if (deps.axios) stack.push("Axios");
  if (deps.antd) stack.push("Ant Design");
  if (deps["@mantine/core"]) stack.push("Mantine");
  if (deps.zod) stack.push("Zod");

  return stack;
}

function buildTree(files) {
  const root = {};

  for (const file of files) {
    const parts = file.relativePath.split("/");
    let cursor = root;

    for (const part of parts) {
      cursor[part] ??= {};
      cursor = cursor[part];
    }
  }

  const lines = [projectName];

  function walk(node, prefix = "") {
    const entries = Object.keys(node).sort((a, b) => {
      const aIsDir = Object.keys(node[a]).length > 0;
      const bIsDir = Object.keys(node[b]).length > 0;

      if (aIsDir !== bIsDir) return aIsDir ? -1 : 1;
      return a.localeCompare(b);
    });

    entries.forEach((name, index) => {
      const isLast = index === entries.length - 1;
      const child = node[name];
      const isDir = Object.keys(child).length > 0;

      lines.push(`${prefix}${isLast ? "└── " : "├── "}${name}${isDir ? "/" : ""}`);

      if (isDir) {
        walk(child, `${prefix}${isLast ? "    " : "│   "}`);
      }
    });
  }

  walk(root);

  return lines.join("\n");
}

async function findExistingPaths(candidatePaths) {
  const found = [];

  for (const candidate of candidatePaths) {
    if (await pathExists(path.join(projectRoot, candidate))) {
      found.push(candidate);
    }
  }

  return found;
}

function createAiContextMarkdown({ packageJson, packageManager, stack, importantPaths, files }) {
  const scripts = packageJson?.scripts ?? {};

  return `# AI Project Context

This ZIP was generated for AI-assisted code review, debugging, refactoring, and feature implementation.

## Project

- Project folder: \`${projectName}\`
- Package manager: \`${packageManager}\`
- Detected stack: ${stack.length ? stack.map((item) => `\`${item}\``).join(", ") : "Unknown"}
- Included file count: ${files.length}
- Generated at: ${new Date().toISOString()}

## Start here

${importantPaths.length ? importantPaths.map((item) => `- \`${item}\``).join("\n") : "- No common entry/config files were found automatically."}

## Suggested reading order for AI

1. Read \`__AI__/AI_CONTEXT.md\`
2. Read \`__AI__/PROJECT_TREE.txt\`
3. Read \`package.json\`
4. Read \`vite.config.*\`
5. Read \`tsconfig*.json\`
6. Read \`src/main.tsx\`
7. Read app/router/layout files
8. Read feature/component files relevant to the user's task

## Available package scripts

${
  Object.keys(scripts).length
    ? Object.entries(scripts)
        .map(([name, value]) => `- \`${name}\`: \`${value}\``)
        .join("\n")
    : "- No scripts found."
}

## Excluded folders

${Array.from(EXCLUDED_DIRS)
  .sort()
  .map((item) => `- \`${item}\``)
  .join("\n")}

## Excluded files

${Array.from(EXCLUDED_FILES)
  .sort()
  .map((item) => `- \`${item}\``)
  .join("\n")}

## Notes

- \`node_modules/\` and build output are intentionally excluded.
- Environment files are intentionally excluded to avoid leaking secrets.
- Prefer source files over generated output.
- Use the lockfile to understand exact dependency versions.
`;
}

function createPackageSummary(packageJson, packageManager) {
  return {
    name: packageJson?.name ?? projectName,
    version: packageJson?.version ?? null,
    private: packageJson?.private ?? null,
    packageManager,
    scripts: packageJson?.scripts ?? {},
    dependencies: packageJson?.dependencies ?? {},
    devDependencies: packageJson?.devDependencies ?? {},
  };
}

async function copyFileToStaging(file) {
  const destinationPath = path.join(stagingDir, ...file.relativePath.split("/"));

  await fsp.mkdir(path.dirname(destinationPath), { recursive: true });
  await fsp.copyFile(file.absolutePath, destinationPath);
}

async function writeTextToStaging(relativePath, content) {
  const destinationPath = path.join(stagingDir, ...relativePath.split("/"));

  await fsp.mkdir(path.dirname(destinationPath), { recursive: true });
  await fsp.writeFile(destinationPath, content, "utf8");
}

function psSingleQuoted(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

async function zipStagingFolderWithPowerShell() {
  const psScriptPath = path.join(outputDir, `_zip-${timestamp}.ps1`);

  const psScript = `
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$Source = ${psSingleQuoted(stagingDir)}
$Destination = ${psSingleQuoted(outputZipPath)}

if (Test-Path -LiteralPath $Destination) {
  Remove-Item -LiteralPath $Destination -Force
}

$CompressionLevel = [System.IO.Compression.CompressionLevel]::Optimal

try {
  $SmallestSize = [System.Enum]::Parse(
    [System.IO.Compression.CompressionLevel],
    "SmallestSize"
  )
  $CompressionLevel = $SmallestSize
} catch {
  $CompressionLevel = [System.IO.Compression.CompressionLevel]::Optimal
}

$FileStream = [System.IO.File]::Open(
  $Destination,
  [System.IO.FileMode]::CreateNew
)

$Archive = New-Object System.IO.Compression.ZipArchive(
  $FileStream,
  [System.IO.Compression.ZipArchiveMode]::Create,
  $false
)

try {
  $SourceFull = [System.IO.Path]::GetFullPath($Source)

  if (-not $SourceFull.EndsWith([System.IO.Path]::DirectorySeparatorChar)) {
    $SourceFull = $SourceFull + [System.IO.Path]::DirectorySeparatorChar
  }

  $Files = Get-ChildItem -LiteralPath $SourceFull -Recurse -File -Force

  foreach ($File in $Files) {
    $FileFull = [System.IO.Path]::GetFullPath($File.FullName)

    if (-not $FileFull.StartsWith($SourceFull, [System.StringComparison]::OrdinalIgnoreCase)) {
      throw "File path is outside staging folder: $FileFull"
    }

    $RelativePath = $FileFull.Substring($SourceFull.Length)
    $EntryName = $RelativePath -replace "\\\\", "/"

    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
      $Archive,
      $FileFull,
      $EntryName,
      $CompressionLevel
    ) | Out-Null
  }
}
finally {
  $Archive.Dispose()
  $FileStream.Dispose()
}
`;

  await fsp.writeFile(psScriptPath, psScript, "utf8");

  await new Promise((resolve, reject) => {
    const child = spawn("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", psScriptPath], {
      stdio: "inherit",
      windowsHide: true,
    });

    child.on("error", reject);

    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`PowerShell ZIP process failed with code ${code}`));
    });
  });

  await fsp.rm(psScriptPath, { force: true });
}

async function main() {
  await fsp.mkdir(outputDir, { recursive: true });
  await fsp.rm(stagingDir, { recursive: true, force: true });
  await fsp.mkdir(stagingDir, { recursive: true });

  const packageJson = await readJsonIfExists(path.join(projectRoot, "package.json"));
  const packageManager = inferPackageManager();
  const stack = detectStack(packageJson);

  const files = await collectFiles(projectRoot);

  const manifest = [];

  for (const file of files) {
    manifest.push({
      path: file.relativePath,
      sizeBytes: file.size,
      sizeHuman: formatBytes(file.size),
      modifiedAt: file.modifiedAt,
      sha256: await hashFile(file.absolutePath),
    });

    await copyFileToStaging(file);
  }

  const importantPaths = await findExistingPaths([
    "README.md",
    "package.json",
    "pnpm-lock.yaml",
    "package-lock.json",
    "yarn.lock",
    "bun.lock",
    "index.html",
    "vite.config.ts",
    "vite.config.js",
    "tailwind.config.ts",
    "tailwind.config.js",
    "eslint.config.js",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "src/main.tsx",
    "src/main.jsx",
    "src/App.tsx",
    "src/App.jsx",
    "src/router.tsx",
    "src/routeTree.gen.ts",
    ".tanstack/router.ts",
  ]);

  await writeTextToStaging(
    "__AI__/AI_CONTEXT.md",
    createAiContextMarkdown({
      packageJson,
      packageManager,
      stack,
      importantPaths,
      files,
    }),
  );

  await writeTextToStaging("__AI__/PROJECT_TREE.txt", buildTree(files));

  await writeTextToStaging("__AI__/FILE_MANIFEST.json", JSON.stringify(manifest, null, 2));

  await writeTextToStaging("__AI__/PACKAGE_SUMMARY.json", JSON.stringify(createPackageSummary(packageJson, packageManager), null, 2));

  await zipStagingFolderWithPowerShell();

  const zipStat = await fsp.stat(outputZipPath);

  await fsp.rm(stagingDir, { recursive: true, force: true });

  console.log("");
  console.log("AI ZIP created successfully.");
  console.log(`Project: ${projectName}`);
  console.log(`Files included: ${files.length}`);
  console.log(`Output: ${outputZipPath}`);
  console.log(`ZIP size: ${formatBytes(zipStat.size)}`);
  console.log("");
}

main().catch(async (error) => {
  await fsp.rm(stagingDir, { recursive: true, force: true }).catch(() => {});

  console.error("");
  console.error("Failed to create AI ZIP.");
  console.error(error);
  console.error("");

  process.exit(1);
});
