const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const TerminalCore = require('./core/terminal')
const QuantumEngine = require('./core/quantum')
const SecurityTools = require('./core/security')

class MainApp {
  constructor() {
    this.windows = new Map()
    this.init()
  }

  init() {
    app.whenReady().then(() => {
      this.createMainWindow()
      this.initQuantum()
      this.initSecurity()
    })
  }

  createMainWindow() {
    const win = new BrowserWindow({
      webPreferences: {
        preload: path.join(__dirname, '../preload.js'),
        contextIsolation: true
      }
    })
    
    win.loadFile('../renderer/index.html')
    this.windows.set('main', win)
  }

  initQuantum() {
    this.quantum = new QuantumEngine()
    ipcMain.handle('quantum-calculate', (_, circuit) => {
      return this.quantum.simulate(circuit)
    })
  }

  initSecurity() {
    this.security = new SecurityTools()
    ipcMain.handle('scan-network', (_, target) => {
      return this.security.scan(target)
    })
  }
}

new MainApp()