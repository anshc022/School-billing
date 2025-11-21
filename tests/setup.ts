import '@testing-library/jest-dom'

// Mock window.api for tests
global.window.api = {
  login: vi.fn(),
  logout: vi.fn(),
  getStudents: vi.fn(),
  getStudent: vi.fn(),
  createStudent: vi.fn(),
  updateStudent: vi.fn(),
  deleteStudent: vi.fn(),
  searchStudents: vi.fn(),
  getFees: vi.fn(),
  getFeesByStudent: vi.fn(),
  createFee: vi.fn(),
  updateFee: vi.fn(),
  deleteFee: vi.fn(),
  getMonthlyReport: vi.fn(),
  getStudentHistory: vi.fn(),
  exportToCSV: vi.fn(),
  exportToExcel: vi.fn(),
  generateSlipPDF: vi.fn(),
  printSlip: vi.fn(),
  previewSlip: vi.fn(),
  getDashboardStats: vi.fn(),
  getSettings: vi.fn(),
  updateSettings: vi.fn(),
  onNotification: vi.fn(),
}
