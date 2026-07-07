import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig, type PluginOption } from "vite";

const normalizeBasePath = (basePath?: string) => {
  const trimmedBasePath = basePath?.trim();

  if (!trimmedBasePath) {
    return "/";
  }

  if (trimmedBasePath === "." || trimmedBasePath === "./") {
    return "./";
  }

  const basePathWithLeadingSlash = trimmedBasePath.startsWith("/") ? trimmedBasePath : `/${trimmedBasePath}`;

  return basePathWithLeadingSlash.endsWith("/") ? basePathWithLeadingSlash : `${basePathWithLeadingSlash}/`;
};

const createBundleAnalyzerPlugin = async (mode: string): Promise<PluginOption[]> => {
  const shouldAnalyze = mode === "analyze" || mode === "analyze-open" || process.env.ANALYZE === "true";

  if (!shouldAnalyze) {
    return [];
  }

  const { visualizer } = await import("rollup-plugin-visualizer");

  return [
    visualizer({
      filename: "dist/bundle-stats.html",
      title: "Atis ERP Bundle Stats",
      template: "treemap",
      gzipSize: true,
      brotliSize: true,
      open: mode === "analyze-open",
    }) as PluginOption,
  ];
};

export default defineConfig(async ({ mode }) => ({
  base: normalizeBasePath(process.env.VITE_BASE_PATH),
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    ...(await createBundleAnalyzerPlugin(mode)),
  ],
  resolve: {
    tsconfigPaths: true,
  },
}));
