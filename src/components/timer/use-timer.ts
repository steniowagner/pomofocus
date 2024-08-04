import { useCallback, useEffect } from "react";

import { storage, events, constants } from "../../utils";
import { Storage, TimerState } from "../../types";
import { useCountdownTimer } from "../../hooks";

type GetStorageResult = Record<
  keyof Pick<Storage, "startTime" | "timerDuration">,
  number
> & { timerState: TimerState };

export const useTimer = () => {
  const countdown = useCountdownTimer();

  const start = useCallback(async () => {
    const startTime = Date.now();
    const [timerDuration] = await Promise.all([
      storage.get<number>("timerDuration"),
      events.sendMessage("START_TIMER", { startTime }),
    ]);
    countdown.start({
      onFinish: () => events.sendMessage("FINISH_TIMER"),
      duration: timerDuration,
      startTime,
    });
  }, [countdown]);

  const reset = useCallback(async () => {
    const [initialTimer] = await Promise.all([
      storage.get<number>("timerDuration"),
      events.sendMessage("RESET_TIMER"),
    ]);
    countdown.reset(initialTimer ?? constants.values.timer.defaultTimer);
  }, [countdown]);

  useEffect(() => {
    const handleStartCountdown = async () => {
      const timers = await storage.get<GetStorageResult>([
        "startTime",
        "timerDuration",
        "timerState",
      ]);
      if (timers.timerState === "RUNNING") {
        countdown.start({
          onFinish: () => events.sendMessage("FINISH_TIMER"),
          duration: timers.timerDuration,
          startTime: timers.startTime,
        });
      }
    };
    handleStartCountdown();
  }, []);

  useEffect(() => {
    storage.subscribe<string>("timerState", (value) => {
      console.log("update: ", value);
    });
    events.onOpenPoup();
  }, []);

  return {
    timeLeft: countdown.timeLeft,
    start,
    reset,
  };
};
