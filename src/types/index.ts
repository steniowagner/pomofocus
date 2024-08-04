import { constants } from "../utils";

export type Storage = Record<keyof typeof constants.values.storage, unknown>;

export type TimerState =
  | "INITIAL"
  | "RUNNING"
  | "PAUSED"
  | "RESET"
  | "FINISHED";
