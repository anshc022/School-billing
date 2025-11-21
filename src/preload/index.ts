import { contextBridge, ipcRenderer } from 'electron'

// Expose API to renderer process
contextBridge.exposeInMainWorld('api', {
  // Auth operations
  login: (username: string, password: string) =>
    ipcRenderer.invoke('auth:login', { username, password }),
  logout: () => ipcRenderer.invoke('auth:logout'),

  // Student operations
  getStudents: () => ipcRenderer.invoke('students:list'),
  getStudent: (id: number) => ipcRenderer.invoke('students:get', { id }),
  createStudent: (data: any) => ipcRenderer.invoke('students:create', data),
  updateStudent: (id: number, data: any) => ipcRenderer.invoke('students:update', { id, ...data }),
  deleteStudent: (id: number) => ipcRenderer.invoke('students:delete', { id }),
  searchStudents: (query: string, filters?: any) =>
    ipcRenderer.invoke('students:search', { query, filters }),
  getStudentByRollNo: (rollNo: string) => ipcRenderer.invoke('students:getByRollNo', { rollNo }),

  // Fee operations
  getFees: () => ipcRenderer.invoke('fees:list'),
  getFeesByStudent: (studentId: number) =>
    ipcRenderer.invoke('fees:getByStudent', { studentId }),
  createFee: (data: any) => ipcRenderer.invoke('fees:create', data),
  updateFee: (id: number, data: any) => ipcRenderer.invoke('fees:update', { id, ...data }),
  deleteFee: (id: number) => ipcRenderer.invoke('fees:delete', { id }),

  // Report operations
  getMonthlyReport: (month: number, year: number) =>
    ipcRenderer.invoke('reports:monthly', { month, year }),
  getStudentHistory: (studentId: number) =>
    ipcRenderer.invoke('reports:studentHistory', { studentId }),
  exportToCSV: (data: any, filename: string) =>
    ipcRenderer.invoke('reports:exportCSV', { data, filename }),
  exportToExcel: (data: any, filename: string) =>
    ipcRenderer.invoke('reports:exportExcel', { data, filename }),

  // Print/PDF operations
  generateSlipPDF: (feeId: number, template?: string) =>
    ipcRenderer.invoke('print:generatePDF', { feeId, template }),
  printSlip: (feeId: number) => ipcRenderer.invoke('print:printSlip', { feeId }),
  previewSlip: (feeId: number) => ipcRenderer.invoke('print:previewSlip', { feeId }),

  // Dashboard
  getDashboardStats: () => ipcRenderer.invoke('dashboard:stats'),

  // Settings
  getSettings: () => ipcRenderer.invoke('settings:get'),
  updateSettings: (settings: any) => ipcRenderer.invoke('settings:update', settings),

  // Listen for notifications
  onNotification: (callback: (message: string, type: string) => void) => {
    ipcRenderer.on('notification', (_event, message, type) => {
      callback(message, type)
    })
  },
})

declare global {
  interface Window {
    api: any
  }
}
