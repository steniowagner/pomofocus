import { Settings as SettingsIcon } from "lucide-react";

import { WorkTimer } from "./components/work-timer/WorkTimer";
import { PauseTimer } from "./components/pause-timer/PauseTimer";
import { Settings } from "./components/settings/Settings";
import { Button } from "../button/Button";
import { usePopup } from "./use-popup";

export const Popup = () => {
  const popup = usePopup();

  return (
    <div className="flex flex-col w-72 bg-background">
      <div className="w-full flex justify-end pr-2 pt-1">
        <Button variant="ghost" size="icon" onClick={popup.onClickSettings}>
          <SettingsIcon className="w-4 h-4" />
        </Button>
      </div>
      <div className="w-full flex flex-col items-center pb-4">
        <WorkTimer />
        <p className="mt-4 text-sm font-medium text-accent-foreground">
          Pomodoros completed: 1/4
        </p>
      </div>
      <PauseTimer />
      {popup.isSettingsOpen && <Settings />}
    </div>
  );
};
