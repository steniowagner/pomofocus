import { messages } from "./constants";

export const sendMessage = <R = void>(
  message: keyof typeof messages,
  params?: Record<string, unknown>
): Promise<R> => {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage({ type: message, params }, (response) => {
        resolve(response as R);
      });
    } catch (err) {
      console.error(err);
      reject();
    }
  });
};

export const openPoup = () => {
  chrome.runtime.connect();
  chrome.storage.local.set({ isPopupOpen: true });
};
