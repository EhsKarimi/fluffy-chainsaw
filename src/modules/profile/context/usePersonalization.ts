import { useContext } from "react";

import { PersonalizationContext } from "@/modules/profile/context/personalization-context-value";

export function usePersonalization() {
  const context = useContext(PersonalizationContext);

  if (!context) {
    throw new Error("usePersonalization must be used inside PersonalizationProvider");
  }

  return context;
}
