/* eslint-disable no-undef */

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
};

const setStorageItem = (message) => {
  const { key, value } = message.params;
  chrome.storage.local.set({ [key]: value });
};

const getStorageItem = (message, sendResponse) => {
  const { key } = message.params;
  chrome.storage.local.get(key, (value) => {
    sendResponse(value[key]);
  });
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_TIMER") {
    getTimer(sendResponse);
  }
  if (message.type === "SET_STORAGE_ITEM") {
    setStorageItem(message);
    sendResponse();
  }
  if (message.type === "GET_STORAGE_ITEM") {
    getStorageItem(message, sendResponse);
  }
  return true;
});
