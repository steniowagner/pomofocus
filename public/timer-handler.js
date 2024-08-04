/* eslint-disable no-undef */

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ TIMER_MINUTES: 5 });
});

const getTimer = (sendResponse) => {
  chrome.storage.local.get(["TIMER_START", "TIMER_MINUTES"], (result) => {
    if (result.TIMER_START === undefined) {
      return sendResponse(result.TIMER_MINUTES);
    }
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

const startTimer = () => {
  chrome.storage.local.set({ TIMER_START: Date.now() });
  chrome.storage.local.get(["TIMER_MINUTES"], (result) => {
    chrome.alarms.clear("POMODORO_FINISHED_ALARM");
    chrome.alarms.create("POMODORO_FINISHED_ALARM", {
      delayInMinutes: result.TIMER_MINUTES / 60,
    });
  });
};

const resetTimer = () => {
  chrome.storage.local.set({ TIMER_START: 0 });
  chrome.alarms.clear("POMODORO_FINISHED_ALARM");
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
  if (message.type === "START_TIMER") {
    startTimer();
    sendResponse();
  }
  if (message.type === "RESET_TIMER") {
    resetTimer();
    sendResponse();
  }
  return true;
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "POMODORO_FINISHED_ALARM") {
    chrome.storage.local.get(["IS_POPUP_OPEN"], (result) => {
      if (!result.IS_POPUP_OPEN) {
        chrome.tabs.query({ active: true }, (tabs) => {
          const [activeTab] = tabs;
          chrome.action.openPopup({ windowId: activeTab.windowId });
        });
      }
    });
  }
});

chrome.runtime.onConnect.addListener((port) => {
  port.onDisconnect.addListener(() => {
    chrome.storage.local.set({ IS_POPUP_OPEN: false });
  });
});
