import { BrowserWindow, app, ipcMain, dialog, Menu } from 'electron'
import path from 'path'
import { initializeDatabase } from './db'
import {
  handleStudentOps,
  handleFeeOps,
  handleAuthOps,
  handleReportOps,
  handlePrintOps,
} from './ipc-handlers'

// Check if we're in development mode
// In development, we use Vite dev server on localhost:5173
// In production, we load from bundled HTML file
const isDev = process.env.npm_lifecycle_event === 'dev:electron' || !app.isPackaged

let mainWindow: BrowserWindow | null = null

const createWindow = async () => {
  // Initialize database on startup
  await initializeDatabase()

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  // Always use localhost during development
  // The wait-on script in package.json waits for port 5173 to be ready
  if (isDev) {
    const startURL = 'http://localhost:5173'
    console.log('Loading URL:', startURL)
    mainWindow.loadURL(startURL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  createMenu()
}

const createMenu = () => {
  const template: Electron.MenuItemConstructorOptions[] = [
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
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// Register IPC handlers
handleAuthOps()
handleStudentOps()
handleFeeOps()
handleReportOps()
handlePrintOps()
