export const sendMessage = <R>(
  message: string,
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
