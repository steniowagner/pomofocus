import { messages } from "./constants";

export const sendMessage = <R = void>(
  message: keyof typeof messages,
  params?: Record<string, unknown>
): Promise<R> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage<unknown, R>(
      { type: message, params },
      (response) => {
        resolve(response);
      }
    );
  });
};

export const openPoup = () => {
  chrome.runtime.connect();
  chrome.storage.local.set({ isPopupOpen: true });
};
