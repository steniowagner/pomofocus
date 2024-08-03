chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ TIMER_MINUTES: 15 });
});

const getTimer = (sendResponse) => {
  chrome.storage.local.get(["TIMER_START", "TIMER_MINUTES"], (result) => {
    if (result.TIMER_START === 0) {
      return sendResponse(0);
    }
    const timeElapsed = Math.floor((Date.now() - result.TIMER_START) / 1000);
    const timeLeft = result.TIMER_MINUTES - timeElapsed;
    sendResponse(timeLeft > 0 ? timeLeft : 0);
  });
  return true;
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_TIMER") {
    return getTimer(sendResponse);
  }
  if (message.type === "SET_STORAGE_ITEM") {
    const { key, value } = message.params;
    chrome.storage.local.set({ [key]: value });
    sendResponse();
  }
  if (message.type === "GET_STORAGE_ITEM") {
    const { key } = message.params;
    chrome.storage.local.get(key, (value) => {
      sendResponse(value[key]);
    });
  }
  return true;
});
