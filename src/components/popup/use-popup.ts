import { useCallback, useState } from "react";

export const usePopup = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  const openSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  // const closeSettings = useCallback(() => {
  //   setIsSettingsOpen(false);
  // }, []);

  return {
    onClickSettings: openSettings,
    isSettingsOpen,
  };
};
