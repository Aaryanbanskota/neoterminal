const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  terminal: {
    execute: (cmd) => ipcRenderer.invoke('terminal-execute', cmd)
  },
  quantum: {
    simulate: (circuit) => ipcRenderer.invoke('quantum-calculate', circuit)
  },
  security: {
    scan: (target) => ipcRenderer.invoke('scan-network', target)
  }
})