/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from "react";

import { useCountdownTimer, useStorage } from "../../hooks";
import { events, constants } from "../../utils";
import { Storage, TimerState } from "../../types";

type GetStorageResult = Record<
  keyof Pick<Storage, "startTime" | "timerDuration">,
  number
> & { timerState: TimerState };

export const useTimer = () => {
  const countdown = useCountdownTimer();
  const storage = useStorage({});

  const start = useCallback(async () => {
    const startTime = Date.now();
    const [timerDuration] = await Promise.all([
      storage.get<number>("timerDuration"),
      events.sendMessage("START_WORK_TIMER", { startTime }),
    ]);
    countdown.start({
      onFinish: () => events.sendMessage("FINISH_WORK_TIMER"),
      duration: timerDuration,
      startTime,
    });
  }, [countdown.start, storage.get]);

  const reset = useCallback(async () => {
    const [initialTimer] = await Promise.all([
      storage.get<number>("timerDuration"),
      events.sendMessage("RESET_WORK_TIMER"),
    ]);
    countdown.reset(initialTimer ?? constants.values.timer.defaultTimer);
  }, [countdown.start, storage.get]);

  useEffect(() => {
    const handleStartCountdown = async () => {
      const timers = await storage.get<GetStorageResult>([
        "startTime",
        "timerDuration",
        "timerState",
      ]);
      if (timers.timerState === "RUNNING") {
        countdown.start({
          onFinish: () => events.sendMessage("FINISH_WORK_TIMER"),
          duration: timers.timerDuration,
          startTime: timers.startTime,
        });
      }
    };
    handleStartCountdown();
  }, []);

  useEffect(() => {
    events.onOpenPoup();
  }, []);

  return {
    timeLeft: countdown.timeLeft,
    start,
    reset,
  };
};
