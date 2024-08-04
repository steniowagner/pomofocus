import { useCallback, useEffect } from "react";
import { constants } from "../utils";

type StorageKey = keyof typeof constants.values.storage;

type StorageChange = {
  [key: string]: chrome.storage.StorageChange;
};

type UseStorageParams = {
  onChange?: (values: Record<string, unknown>) => void;
  keysToWatch?: StorageKey | StorageKey[];
};

export const useStorage = (params: UseStorageParams) => {
  const get = useCallback(
    async <T>(key: StorageKey | StorageKey[]): Promise<T> => {
      return new Promise((resolve) => {
        const keys = Array.isArray(key) ? key : [key];
        chrome.storage.local.get(keys, (value) => {
          if (!Array.isArray(key)) {
            return resolve(value[key] as T);
          }
          resolve(value as T);
        });
      });
    },
    []
  );

  const set = useCallback(async (key: StorageKey, value: unknown) => {
    chrome.storage.local.set({ [key]: value });
  }, []);

  const handleStorageChange = useCallback(
    (change: StorageChange) => {
      const watchedKeys = (
        Array.isArray(params.keysToWatch)
          ? params.keysToWatch
          : [params.keysToWatch]
      ) as StorageKey[];
      const isWatchedKeyUpdated = watchedKeys.some((watchedKey) =>
        Object.keys(change).includes(watchedKey as string)
      );
      if (!isWatchedKeyUpdated) {
        return;
      }
      const updatedValues = Object.keys(change).reduce((previous, current) => {
        const isWatchedKey = watchedKeys.includes(current as StorageKey);
        if (isWatchedKey) {
          return {
            ...previous,
            [current]: change[current].newValue,
          };
        }
        return previous;
      }, {});
      params.onChange && params.onChange(updatedValues);
    },
    [params]
  );

  useEffect(() => {
    if (!params.keysToWatch) {
      return;
    }
    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  return {
    get,
    set,
  };
};
