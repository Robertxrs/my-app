const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // add APIs if needed
});
