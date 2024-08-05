import { constants } from "../utils";

export type Storage = Record<keyof typeof constants.values.storage, unknown>;

export type TimerState =
  | "IDLE"
  | "WORKING"
  | "RESET"
  | "FINISHED"
  | "SHORT_PAUSE"
  | "LONG_PAUSE";
