import { createTheme } from "@mantine/core";

import { atisCyan } from "@/shared/theme/color-tokens";

export const mainTheme = createTheme({
  primaryColor: "atisCyan",
  primaryShade: { light: 5, dark: 5 },
  defaultRadius: "md",
  colors: {
    atisCyan: [...atisCyan],
  },
  fontFamily: "Vazirmatn, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  headings: {
    fontFamily: "Vazirmatn, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontWeight: "800",
  },
  components: {
    TextInput: {
      defaultProps: {
        classNames: {
          input: "bg-white text-slate-900 border-slate-300 placeholder:text-slate-400",
          label: "text-slate-700",
        },
      },
    },
    PasswordInput: {
      defaultProps: {
        classNames: {
          input: "bg-white text-slate-900 border-slate-300 placeholder:text-slate-400",
          innerInput: "text-slate-900 placeholder:text-slate-400",
          label: "text-slate-700",
        },
      },
    },
  },
});
