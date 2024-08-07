import "@testing-library/jest-dom";
import { vi } from "vitest";

import { constants } from "../utils";

export const defaultStorage = {
  ...constants.values.timer,
  timerState: "IDLE",
  pauseDuration: 3 * 60,
  currentWorkingSession: 1,
  theme: "light",
};

const storage = {
  local: {
    get: vi.fn((_keys, callback) => callback(defaultStorage)),
    set: vi.fn(),
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
