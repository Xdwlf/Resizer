/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

const chromeStorageKey = "rw-window-local"

//create initialization function (set default windows on installation)
chrome.runtime.onInstalled.addListener(function () {
    chrome.windows.get(chrome.windows.WINDOW_ID_CURRENT, (currentWindow) => {
        const fullWindowOption = {
            id: Math.floor(Math.random() * 10000),
            name: 'Full Screen',
            isDefault: true,
            isPreset: false,
            settings: {
                height: screen.availHeight,
                width: screen.availWidth + screen.availLeft,
                top: 0,
                left: 0
            }
        }
        const newSavedValue = {
            [chromeStorageKey]: {
                options: [fullWindowOption],
            }
        }
        chrome.storage.local.set(newSavedValue)
    });
});

// listen to toggling
chrome.webNavigation.onCommitted.addListener(function (e) {
    chrome.storage.local.get(chromeStorageKey, (storageVal) => {
        const defaultWindow = storageVal[chromeStorageKey]?.options.find((option) => option.isDefault);
        if (defaultWindow) {
            chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, defaultWindow.settings)
        }
    })
}, {
    url: [{
        urlContains: 'localhost',
        pathEquals: '/'
    },
    {
        hostEquals: 'dev-rw.sureprep.com',
        pathEquals: '/'
    },
    {
        hostEquals: 'qa-rw.sureprep.com',
        pathEquals: '/'
    },
    {
        hostEquals: 'stage-rw.sureprep.com',
        pathEquals: '/'
    },
    {
        hostEquals: 'reviewwizard.sureprep.com',
        pathEquals: '/'
    }]
});
