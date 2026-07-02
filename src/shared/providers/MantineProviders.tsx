import { MantineProvider } from "@mantine/core";
import { type PropsWithChildren } from "react";

import { mainTheme } from "@/shared/theme/mainTheme";

type MantineProvidersProps = PropsWithChildren;
export function MantineProviders({ children }: MantineProvidersProps) {
  return (
    <MantineProvider theme={mainTheme} defaultColorScheme="light" deduplicateInlineStyles>
      {children}
    </MantineProvider>
  );
}
