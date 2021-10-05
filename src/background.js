'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'

import { Image } from '@/util/image'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

// 启动参数
let processUrl = ''
console.debug(process.env.WEBPACK_DEV_SERVER_URL)
if (process.env.WEBPACK_DEV_SERVER_URL) {
  const debugUrl = 'F:/我的文件/D9llkdQU8AAnMsB.jpg'
  processUrl = debugUrl.replaceAll('\\', '/')
} else {
  if (process.argv[1]) {
    processUrl = process.argv[1].replaceAll('\\', '/')
  }
}

async function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 138,
    minHeight: 200,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    },
    transparent: true,
    backgroundColor: '#FFFFFFFF',
    // frame: false,
    show: false
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }

  win.once('ready-to-show', () => {
    win.show()
  })
}

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
  // 自定义file:///协议的解析
  protocol.interceptFileProtocol('file', (req, callback) => {
    const url = req.url.substr(8)
    callback(decodeURI(url))
  })

  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()

  const imageUtil = new Image(processUrl)
  // 通信监听
  ipcMain.on('load-images', function (event) {
    event.returnValue = imageUtil.getImageList()
  })
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
