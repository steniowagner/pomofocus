export const messages = {
  START_TIMER: "START_TIMER",
  RESET_TIMER: "RESET_TIMER",
  CONNECT_POPUP: "CONNECT_POPUP",
};

export const values = {
  storage: {
    timerDuration: "timerDuration",
    startTime: "startTime",
    isPopupOpen: "isPopupOpen",
  },
  timer: {
    defaultTimer: 30, // 60 * 25,
  },
};

export type Storage = Record<keyof typeof values.storage, unknown>;
