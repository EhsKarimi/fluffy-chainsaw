import { atisCyanTailwindPalette } from "./src/shared/theme/color-tokens";

const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        atisCyan: atisCyanTailwindPalette,
      },
      fontSize: {
        "badge-xs": ["0.6875rem", { lineHeight: "1rem" }],
        "nav-root": ["0.8125rem", { lineHeight: "1.25rem" }],
      },
      gridTemplateColumns: {
        "auth-panel": "minmax(0, 0.95fr) minmax(430px, 0.55fr)",
      },
      lineHeight: {
        "auth-title": "1.35",
      },
      maxWidth: {
        "auth-form": "28rem",
      },
      minHeight: {
        "permission-page": "calc(100vh - 9rem)",
      },
    },
  },
};

export default tailwindConfig;
