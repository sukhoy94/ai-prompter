const { app, BrowserWindow, Menu } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const { spawn } = require('child_process')
const http = require('http')

let mainWindow
let nextServer

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  const startUrl = isDev ? 'http://localhost:3000' : 'http://localhost:3000'

  mainWindow.loadURL(startUrl)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

const waitForServer = (url, timeout = 30000) => {
  return new Promise((resolve) => {
    const startTime = Date.now()
    const checkServer = () => {
      http
        .get(url, (res) => {
          if (res.statusCode === 200) {
            resolve()
          } else {
            setTimeout(checkServer, 500)
          }
        })
        .on('error', () => {
          if (Date.now() - startTime < timeout) {
            setTimeout(checkServer, 500)
          } else {
            resolve()
          }
        })
    }
    checkServer()
  })
}

const startNextServer = () => {
  return new Promise((resolve) => {
    const cmd = isDev ? 'dev' : 'start'
    nextServer = spawn('npm', ['run', cmd], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
    })

    waitForServer('http://localhost:3000').then(() => resolve())
  })
}

app.on('ready', async () => {
  await startNextServer()
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }

  if (nextServer) {
    nextServer.kill()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// Create application menu
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Exit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          app.quit()
        },
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
    ],
  },
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
