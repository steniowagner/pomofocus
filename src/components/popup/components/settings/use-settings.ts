import { useCallback, useEffect, useState } from "react";

import { useStorage, StorageKey } from "../../../../hooks/use-storage";
import { constants } from "../../../../utils";

type Settings = {
  numberWorkingSessions: number;
  workingDuration: number;
  shortPauseDuration: number;
  longPauseDuration: number;
};

type UseSettingsProps = {
  onSaveSettings: () => void;
};

export const useSettings = (props: UseSettingsProps) => {
  const [settings, setSettings] = useState<Settings>({
    numberWorkingSessions: constants.values.timer.numberWorkingSessions,
    workingDuration: constants.values.timer.workingDuration,
    shortPauseDuration: constants.values.timer.shortPauseDuration,
    longPauseDuration: constants.values.timer.longPauseDuration,
  });

  const storage = useStorage({});

  const saveSettings = useCallback(async () => {
    await Promise.all(
      Object.keys(settings).map((setting) => {
        let value = settings[setting as keyof Settings];
        if (setting !== "numberWorkingSessions") {
          value *= 60;
        }
        return storage.set(setting as StorageKey, value);
      })
    );
    props.onSaveSettings();
  }, [settings, storage, props]);

  const changeSettings = useCallback((key: keyof Settings, value: string) => {
    setSettings((previousSettings) => ({
      ...previousSettings,
      [key]: Number(value),
    }));
  }, []);

  useEffect(() => {
    const handleSetSettingsFromStorage = async () => {
      const settingsFromStorage = await storage.get<Settings>([
        "numberWorkingSessions",
        "workingDuration",
        "shortPauseDuration",
        "longPauseDuration",
      ]);
      settingsFromStorage.workingDuration /= 60;
      settingsFromStorage.shortPauseDuration /= 60;
      settingsFromStorage.longPauseDuration /= 60;
      setSettings(settingsFromStorage);
    };
    handleSetSettingsFromStorage();
  }, []);

  return {
    ...(settings ?? {}),
    onClickSaveSettings: saveSettings,
    onChangeSettings: changeSettings,
  };
};
