import { values } from "./constants";

type Key = keyof typeof values.storage;

export const get = async <T>(key: Key | Key[]): Promise<T> => {
  return new Promise((resolve) => {
    const keys = Array.isArray(key) ? key : [key];
    chrome.storage.local.get(keys, (value) => {
      if (!Array.isArray(key)) {
        return resolve(value[key] as T);
      }
      resolve(value as T);
    });
  });
};

export const set = async (key: Key, value: unknown) => {
  chrome.storage.local.set({ [key]: value });
};

export const subscribe = <T>(key: Key, onChange: (value: T) => void) => {
  chrome.storage.onChanged.addListener((storage) => {
    if (storage[key]) {
      onChange(storage[key].newValue as T);
    }
  });
};
