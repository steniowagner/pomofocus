import { useCallback, useEffect, useState } from "react";

import { events } from "../../utils";

export const usePopup = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  useEffect(() => {
    events.openPoup();
  }, []);

  return {
    onClickSettings: openSettings,
    closeSettings,
    isSettingsOpen,
  };
};
