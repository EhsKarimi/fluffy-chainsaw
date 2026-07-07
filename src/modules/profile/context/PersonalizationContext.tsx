import { type PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";

import { PersonalizationContext, type PersonalizationContextValue } from "@/modules/profile/context/personalization-context-value";
import {
  defaultUserPersonalizationSettings,
  fetchUserPersonalizationSettingsFromApi,
  loadUserPersonalizationSettingsFromStorage,
  saveUserPersonalizationSettingsToApi,
  saveUserPersonalizationSettingsToStorage,
} from "@/modules/profile/services/personalization-settings";
import { type UserPersonalizationSettings } from "@/modules/profile/types/personalization.types";

function getFontSizeScale(fontSize: UserPersonalizationSettings["fontSize"]) {
  if (fontSize === "compact") {
    return "0.94";
  }

  if (fontSize === "large") {
    return "1.08";
  }

  if (fontSize === "extraLarge") {
    return "1.16";
  }

  return "1";
}

export function PersonalizationProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<UserPersonalizationSettings>(() => loadUserPersonalizationSettingsFromStorage());
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const rootElement = document.documentElement;

    rootElement.dataset.atisFontSize = settings.fontSize;
    rootElement.dataset.atisDensity = settings.density;
    rootElement.dataset.atisReduceMotion = settings.reduceMotion ? "true" : "false";
    rootElement.style.setProperty("--atis-font-scale", getFontSizeScale(settings.fontSize));
  }, [settings]);

  useEffect(() => {
    let isMounted = true;

    const syncSettings = async () => {
      setIsSyncing(true);

      try {
        const apiSettings = await fetchUserPersonalizationSettingsFromApi();

        if (apiSettings && isMounted) {
          saveUserPersonalizationSettingsToStorage(apiSettings);
          setSettings(apiSettings);
        }
      } finally {
        if (isMounted) {
          setIsSyncing(false);
        }
      }
    };

    void syncSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const saveSettings = useCallback(async (nextSettings: UserPersonalizationSettings) => {
    setIsSaving(true);

    try {
      const apiSavedSettings = await saveUserPersonalizationSettingsToApi(nextSettings);

      saveUserPersonalizationSettingsToStorage(apiSavedSettings);
      setSettings(apiSavedSettings);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const resetSettings = useCallback(async () => {
    await saveSettings(defaultUserPersonalizationSettings);
  }, [saveSettings]);

  const value = useMemo<PersonalizationContextValue>(
    () => ({ isSaving, isSyncing, resetSettings, saveSettings, settings }),
    [isSaving, isSyncing, resetSettings, saveSettings, settings],
  );

  return <PersonalizationContext.Provider value={value}>{children}</PersonalizationContext.Provider>;
}
