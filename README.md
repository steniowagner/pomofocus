

<img src="https://github.com/steniowagner/pomofocus/blob/main/public/icon.png" width="120" />

# Pomofocus

Bring focus in and push distractions away.

# App images

### Dark mode
<img src="https://github.com/steniowagner/pomofocus/blob/main/images/initial-dark.png" width="250" /> _
<img src="https://github.com/steniowagner/pomofocus/blob/main/images/settings-1-dark.png" width="250" /> _
<img src="https://github.com/steniowagner/pomofocus/blob/main/images/settings-2-dark.png" width="250" /> _

### Light mode
<img src="https://github.com/steniowagner/pomofocus/blob/main/images/initial-light.png" width="250" /> _
<img src="https://github.com/steniowagner/pomofocus/blob/main/images/settings-1-light.png" width="250" /> _
<img src="https://github.com/steniowagner/pomofocus/blob/main/images/settings-2-light.png" width="250" /> _

## Getting Started

### Prerequisites

To run this project locally, make sure that you have npm and NodeJS installed in your local environment. If you don't have nodejs/npm installed locally, you can find the download page [here](https://nodejs.org/en/download/package-manager).

### Installing

**Cloning the Repository**

```
$ git clone https://github.com/steniowagner/pomofocus

$ cd pomofocus
```

> For sake of simplicify, I'll be using npm as the package-manager for this tutorial. But you can use your favorite one as well.

**Installing dependencies**

```
$ npm install
```

**Building**

Before we import our extenion into Google Chrome, we have to build it.

```
$ npm run build
```

It will generate a dist folder at the root folder, and this will be the artifacts that we'll upload to Chrome. You can find how to proceed with this upload [here](https://support.google.com/chrome/a/answer/2714278?hl=en#:~:text=Go%20to%20chrome%3A%2F%2Fextensions,the%20app%20or%20extension%20folder.).

**Testing**

You can run the test-cases in the project by running the following script:

```
$ npm run test
```

**My solution**

I would like to talk a bit about a core concept that I decided to implement to build this project. Since we're dealing with two different environements (Chrome and React/Client-side), I decided to apply a event-based architecture, which means that both sides of the app are comunicating by sending events.

Each event has a specific task and can also modify the Chrome storage, and each one of them will be changing the state of the timer.
<img src="https://github.com/steniowagner/pomofocus/blob/main/images/events.png" alt="Events flow" width="700" />

Also, in order to have a better separation of concerns, I decided to access the chrome-apis only in a specific files, so if we want to change from chrome to another browser, it'll make this migration process easier:

[use-storage](https://github.com/steniowagner/pomofocus/blob/main/src/hooks/use-storage.ts): I use this hook as a layer to access and save data from the client-side to the chrome-api. Since I decided to adopt the event-base approach, I also created a listener for the changes that happens in the storage, so the clients can subscribe and be notified when a specific data changed in the storage.

[events](https://github.com/steniowagner/pomofocus/blob/main/src/utils/events.ts): These functions are the core bridge between the client and chrome apis. Through this, the clients will send the events and modify data in the storage.

_A quick note about the "events.openPopup": I'll explain it in a bit!_

**Chrome APIs used**

- [storage](https://developer.chrome.com/docs/extensions/reference/api/storage): This is the API that makes possible to save data into the chrome-storage. At the moment, I just used the "local" storage provided by the chrome api.

- [alarms](https://developer.chrome.com/docs/extensions/reference/api/alarms): When the user finishes a work-cycle or when a pause-cycle is finished, I want to open up the Popup. In order to do this, whenever the user starts or finishes a work-cycle or a pause-cycle, I create an alarm and schedule it to open the popup after a specified time (rest-time for rest cycles or work-time for work-cycle).

- [tabs](https://developer.chrome.com/docs/extensions/reference/api/tabs): Whenever I want to open the Popup using the alarm API, I need to make sure that the Popup will be open in the correct window/tab. So, [I use the tabs API](https://github.com/steniowagner/pomofocus/blob/main/public/timer-handler.js#L20) to get which is the active window and in this active window which is the active tab, and from that tab I'll be opening the Popup.

**About the "events.openPopup"**: This function will help to understand is the popup is open or not. This is important because If we try to open a popup that is already open, we'll have an error.

To solve this, when I call this function, I'm saving the value "isPopupOpen": true in the storage, and this value means that the popup is open. I used the [chrome.runtime.connect](https://developer.chrome.com/docs/extensions/reference/api/runtime) to create a connection for the popup, and when this connection is lost, I'll set the "isPopupOpen" to false in the storage.
