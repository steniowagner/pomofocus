import { sendMessage } from "./events";
import { messages } from "./constants";

export const get = async <T>(key: string, defaultValue: T): Promise<T> => {
  const value = await sendMessage<T>(messages.GET_STORAGE_ITEM, {
    key,
  });
  return value ?? defaultValue;
};

export const set = async (key: string, value: unknown) =>
  sendMessage(messages.SET_STORAGE_ITEM, {
    key,
    value,
  });
