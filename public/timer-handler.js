/* eslint-disable no-undef */

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ timerDuration: 5, timerState: "IDLE" });
});

const startTimer = ({ startTime }) => {
  chrome.storage.local.set({ startTime, timerState: "RUNNING" });
  chrome.storage.local.get(["timerDuration"], (result) => {
    chrome.alarms.clear("POMODORO_FINISHED_ALARM");
    chrome.alarms.create("POMODORO_FINISHED_ALARM", {
      delayInMinutes: result.timerDuration / 60,
    });
  });
};

const resetTimer = () => {
  chrome.storage.local.set({ startTime: 0, timerState: "RESET" });
  chrome.alarms.clear("POMODORO_FINISHED_ALARM");
};

const finishTimer = () => {
  chrome.storage.local.set({ startTime: 0, timerState: "FINISHED" });
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "START_TIMER") {
    startTimer(message.params);
  }
  if (message.type === "RESET_TIMER") {
    resetTimer();
  }
  if (message.type === "FINISH_TIMER") {
    finishTimer();
  }
  sendResponse();
  return true;
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "POMODORO_FINISHED_ALARM") {
    chrome.storage.local.get("isPopupOpen", (result) => {
      if (!result.isPopupOpen) {
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
    chrome.storage.local.set({ isPopupOpen: false });
  });
});
