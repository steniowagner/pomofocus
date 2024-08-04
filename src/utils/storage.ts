import { sendMessage } from "./events";
import { values } from "./constants";

type Key = keyof typeof values.storage;

export const get = async <T>(key: Key, defaultValue: T): Promise<T> => {
  const value = await sendMessage<T>("GET_STORAGE_ITEM", {
    key,
  });
  return value ?? defaultValue;
};

export const set = async (key: Key, value: unknown) =>
  sendMessage("SET_STORAGE_ITEM", {
    key,
    value,
  });
