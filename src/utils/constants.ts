export const messages = {
  CONNECT_POPUP: "CONNECT_POPUP",
  RESET_WORK_TIMER: "RESET_WORK_TIMER",
  START_WORK_TIMER: "START_WORK_TIMER",
  FINISH_WORK_TIMER: "FINISH_WORK_TIMER",
  START_PAUSE_TIMER: "START_PAUSE_TIMER",
  FINISH_PAUSE_TIMER: "FINISH_PAUSE_TIMER",
};

export const values = {
  storage: {
    workingDuration: "workingDuration",
    workingStartTime: "workingStartTime",
    timerState: "timerState",
    pauseDuration: "pauseDuration",
    pauseStartTime: "pauseStartTime",
    currentWorkingSession: "currentWorkingSession",
    numberWorkingSessions: "numberWorkingSessions",
    shortPauseDuration: "shortPauseDuration",
    longPauseDuration: "longPauseDuration",
  },
  timer: {
    maxValue: 60 * 24, // onde day,
    numberWorkingSessions: 3,
    workingDuration: 25,
    shortPauseDuration: 5,
    longPauseDuration: 10,
  },
};
