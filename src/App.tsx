import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faWindowMaximize, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import './App.css';

const chromeStorageKey = "rw-window-local"

type WindowOption = {
  id: number;
  name: string;
  settings: {
    top: number;
    left: number;
    width: number;
    height: number;
  }
}

type ChromeStorage = {
  [chromeStorageKey]?: {
    options: WindowOption[];
  }
}

function App() {
  const [showSave, setShowSave] = React.useState(false)
  const [inputVal, setInputVal] = React.useState('')
  const [options, setOptions] = React.useState<WindowOption[]>([])

  React.useEffect(() => {
    chrome.storage.local.get(chromeStorageKey, (storageVal) => {
      const prevStorageVal = storageVal as ChromeStorage;
      if (prevStorageVal[chromeStorageKey]?.options) {
        setOptions(prevStorageVal[chromeStorageKey]!.options)
      }
    })
  }, [])
  return (
    <div className="App">
      {
        showSave ? (
          <div className="saveView">
            <h3>Name Your Setting</h3>
            <input
              className="input"
              value={inputVal} onChange={(e) => setInputVal(e.target.value)}></input>
            <div className="buttonGroup">
              <button
                className="confirmButton"
                onClick={() => {
                  chrome.windows.get(chrome.windows.WINDOW_ID_CURRENT, (currentWindow) => {
                    chrome.storage.local.get((storageVal) => {
                      const prevStorageVal = storageVal as ChromeStorage
                      const newValue: WindowOption = {
                        id: Math.floor(Math.random() * 10000),
                        name: inputVal,
                        settings: {
                          width: currentWindow.width ?? 0,
                          height: currentWindow.height ?? 0,
                          top: currentWindow.top ?? 0,
                          left: currentWindow.left ?? 0
                        }
                      }
                      let newOptions;
                      if (prevStorageVal[chromeStorageKey]?.options) {
                        newOptions = [...prevStorageVal[chromeStorageKey]!.options, newValue]
                      } else {
                        newOptions = [newValue]
                      }
                      const newSavedValue: ChromeStorage = {
                        [chromeStorageKey]: {
                          options: newOptions,
                        }
                      }
                      chrome.storage.local.set(newSavedValue, () => {
                        setOptions((prevOptions) => {
                          return [...prevOptions, newValue]
                        })
                        setShowSave(false)
                        setInputVal('')
                      })
                    })
                  })
                }}>
                <FontAwesomeIcon
                  color="#5cb85c"
                  className="leftSvg"
                  icon={faCheck} />
                SAVE
                </button>
              <button
                className="cancelButton"
                onClick={() => {
                  setShowSave(false)
                }}>
                <FontAwesomeIcon
                  color="#CC2222"
                  className="leftSvg"
                  icon={faTimes} />
                  CANCEL
                  </button>
            </div>
          </div>
        ) : (
            <div className="main">
              <h3>
                Resizing App
              </h3>
              <div>Your Saved Windows</div>
              <div className="windowOptions">
                {
                  options.length === 0 ? <em>You have no custom settings saved.</em> : (
                    options.map((windowOption) => {
                      return (
                        <div
                          key={windowOption.id}
                          className="option"
                        >
                          <div className="optionLeft"
                            onClick={() => {
                              chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, windowOption.settings)
                            }}
                          >
                            <div className="optionName"><FontAwesomeIcon icon={faWindowMaximize}></FontAwesomeIcon> {windowOption.name}:</div>
                            <div className="optionSize">{windowOption.settings.width}x{windowOption.settings.height}</div>
                          </div>
                          <div onClick={() => {
                            const newOptions = options.filter((option) => option.id !== windowOption.id)
                            const newSavedValue: ChromeStorage = {
                              [chromeStorageKey]: {
                                options: newOptions,
                              }
                            }
                            chrome.storage.local.set(newSavedValue, () => {
                              setOptions(newOptions)
                              setShowSave(false)
                            })

                          }} className="deleteOption"><FontAwesomeIcon icon={faTimes} /></div>
                        </div>)
                    })
                  )
                }
              </div>
              <button
                className="saveWindowButton"
                onClick={() => {
                  setShowSave(true)
                }}>
                <FontAwesomeIcon
                  color="#E9C46A"
                  className="leftSvg saveSvg"
                  icon={faSave}

                />
                SAVE WINDOW
                </button>
            </div>
          )
      }

    </div>
  );
}

export default App;
