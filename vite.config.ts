import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const normalizeBasePath = (basePath?: string) => {
  const trimmedBasePath = basePath?.trim();

  if (!trimmedBasePath) {
    return "/";
  }

  if (trimmedBasePath === "." || trimmedBasePath === "./") {
    return "./";
  }

  const basePathWithLeadingSlash = trimmedBasePath.startsWith("/")
    ? trimmedBasePath
    : `/${trimmedBasePath}`;

  return basePathWithLeadingSlash.endsWith("/")
    ? basePathWithLeadingSlash
    : `${basePathWithLeadingSlash}/`;
};

export default defineConfig({
  base: normalizeBasePath(process.env.VITE_BASE_PATH),
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
