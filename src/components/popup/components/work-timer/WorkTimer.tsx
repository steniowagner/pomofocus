import { PlayIcon, RefreshCcw } from "lucide-react";

import { useWorkTimer } from "./use-work-timer";
import { Button } from "../../..";

export const WorkTimer = () => {
  const workTimer = useWorkTimer();

  return (
    <div data-testid="work-timer" className="flex flex-col">
      <h1
        data-testid="work-timer-time-left"
        className="text-3xl w-auto self-center font-bold text-accent-foreground"
      >
        {workTimer.timeLeft}
      </h1>
      <div className="w-full flex justify-center items-center gap-x-4 mt-4">
        <Button
          disabled={workTimer.isStartButtonDisabled}
          size="sm"
          onClick={workTimer.start}
          data-testid="work-timer-start-button"
        >
          <PlayIcon className="w-4 h-4 mr-1" />
          Start
        </Button>
        <Button
          disabled={workTimer.isResetButtonDisabled}
          size="sm"
          variant="secondary"
          onClick={workTimer.reset}
          data-testid="work-timer-reset-button"
        >
          <RefreshCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>
    </div>
  );
};
