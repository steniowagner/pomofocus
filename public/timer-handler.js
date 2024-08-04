/* eslint-disable no-undef */

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ timerDuration: 5 });
});

const startTimer = ({ startTime }) => {
  chrome.storage.local.set({ startTime });
  chrome.storage.local.get(["timerDuration"], (result) => {
    chrome.alarms.clear("POMODORO_FINISHED_ALARM");
    chrome.alarms.create("POMODORO_FINISHED_ALARM", {
      delayInMinutes: result.timerDuration / 60,
    });
  });
};

const resetTimer = () => {
  chrome.storage.local.set({ startTime: 0 });
  chrome.alarms.clear("POMODORO_FINISHED_ALARM");
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "START_TIMER") {
    console.log("message.params: ", message.params);
    startTimer(message.params);
  }
  if (message.type === "RESET_TIMER") {
    resetTimer();
  }
  sendResponse();
  return true;
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "POMODORO_FINISHED_ALARM") {
    chrome.storage.local.get("isPoupOpen", (result) => {
      if (!result.isPoupOpen) {
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
    chrome.storage.local.set({ isPoupOpen: false });
  });
});
