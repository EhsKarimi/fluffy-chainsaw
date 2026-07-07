import { createContext } from "react";

import { type UserPersonalizationSettings } from "@/modules/profile/types/personalization.types";

export type PersonalizationContextValue = {
  isSaving: boolean;
  isSyncing: boolean;
  resetSettings: () => Promise<void>;
  saveSettings: (settings: UserPersonalizationSettings) => Promise<void>;
  settings: UserPersonalizationSettings;
};

export const PersonalizationContext = createContext<PersonalizationContextValue | null>(null);
