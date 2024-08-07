import "@testing-library/jest-dom";

import { vi } from "vitest";

const storage = {
  local: {
    get: vi.fn((_keys, callback) =>
      callback({
        timerState: "IDLE",
        workingDuration: 3,
        pauseDuration: 3,
        shortPauseDuration: 3,
        longPauseDuration: 5,
        currentWorkingSession: 1,
        numberWorkingSessions: 3,
        theme: "light",
      })
    ),
    set: vi.fn((_items, callback) => callback()),
  },
  onChanged: {
    addListener: vi.fn(),
    removeListener: vi.fn(),
  },
};

const runtime = {
  sendMessage: vi.fn((_items, callback) => callback()),
  connect: vi.fn(),
};

const chrome = {
  storage,
  runtime,
};

vi.stubGlobal("chrome", chrome);
