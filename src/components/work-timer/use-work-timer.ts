/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from "react";

import { useCountdownTimer, useStorage } from "../../hooks";
import { events, constants } from "../../utils";
import { Storage, TimerState } from "../../types";

type GetStorageResult = Record<
  keyof Pick<Storage, "workingStartTime" | "workingDuration">,
  number
> & { timerState: TimerState };

export const useWorkTimer = () => {
  const countdown = useCountdownTimer();
  const storage = useStorage({});

  const start = useCallback(async () => {
    const workingStartTime = Date.now();
    const [workingDuration] = await Promise.all([
      storage.get<number>("workingDuration"),
      events.sendMessage("START_WORK_TIMER", { workingStartTime }),
    ]);
    countdown.start({
      onFinish: () => events.sendMessage("FINISH_WORK_TIMER"),
      duration: workingDuration,
      startTime: workingStartTime,
    });
  }, [countdown.start, storage.get]);

  const reset = useCallback(async () => {
    const [initialTimer] = await Promise.all([
      storage.get<number>("workingDuration"),
      events.sendMessage("RESET_WORK_TIMER"),
    ]);
    countdown.reset(initialTimer ?? constants.values.timer.defaultTimer);
  }, [countdown.start, storage.get]);

  useEffect(() => {
    const handleStartCountdown = async () => {
      const timers = await storage.get<GetStorageResult>([
        "workingStartTime",
        "workingDuration",
        "timerState",
      ]);
      if (timers.timerState === "WORKING") {
        countdown.start({
          onFinish: () => events.sendMessage("FINISH_WORK_TIMER"),
          duration: timers.workingDuration,
          startTime: timers.workingStartTime,
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
