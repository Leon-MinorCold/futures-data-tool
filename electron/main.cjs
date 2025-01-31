const { app, BrowserWindow } = require('electron')
const path = require('path')

const dotenv = require('dotenv')

// 加载 .env 文件，确保路径正确
const dotenvPath = path.join(process.cwd(), '.env')
dotenv.config({ path: dotenvPath })

const isDev = process.env.NODE_ENV === 'development'

// 创建主窗口
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'), // 预加载脚本
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  isDev && mainWindow.webContents.openDevTools()

  mainWindow.maximize() // 🚀 窗口占满整个屏幕
  mainWindow.show() // 显示窗口

  // 加载 React 应用

  if (isDev) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.on('did-finish-load', () => {
      const currentURL = mainWindow.webContents.getURL()
      console.log('Current URL:', currentURL)
    })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

// Electron 初始化完成后创建窗口
app.whenReady().then(createWindow)

// 关闭所有窗口时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
