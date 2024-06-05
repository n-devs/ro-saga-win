const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("windowControls", {
    initialize: async (browserWindowId) => await ipcRenderer.invoke("window-controls/initialize", browserWindowId),
    setMaximumize: (browserWindowId) => ipcRenderer.send("window-controls/maximumize/set", browserWindowId),
    setMinimumize: (browserWindowId) => ipcRenderer.send("window-controls/minimumize/set", browserWindowId),
    changeMaximumize: (onMaximimizeStateChange) => ipcRenderer.on("window-controls/maximunize/change", onMaximimizeStateChange),
    changeMinimumize: (onMaximimizeStateChange) => ipcRenderer.removeListener("window-controls/minimumize/change", onMaximimizeStateChange),
    close: (browserWindowId) => ipcRenderer.send("window-controls/close", browserWindowId)
})
