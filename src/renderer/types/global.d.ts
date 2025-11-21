export {}

declare global {
  interface Window {
    api: {
      // Auth
      login: (username: string, password: string) => Promise<any>
      logout: () => Promise<any>
      
      // Students
      getStudents: () => Promise<any>
      getStudent: (id: number) => Promise<any>
      createStudent: (data: any) => Promise<any>
      updateStudent: (id: number, data: any) => Promise<any>
      deleteStudent: (id: number) => Promise<any>
      searchStudents: (query: string, filters?: any) => Promise<any>
      getStudentByRollNo: (rollNo: string) => Promise<any>

      // Fees
      getFees: () => Promise<any>
      getFeesByStudent: (studentId: number) => Promise<any>
      createFee: (data: any) => Promise<any>
      updateFee: (id: number, data: any) => Promise<any>
      deleteFee: (id: number) => Promise<any>

      // Reports
      getMonthlyReport: (month: number, year: number) => Promise<any>
      getStudentHistory: (studentId: number) => Promise<any>
      exportToCSV: (data: any, filename: string) => Promise<any>
      exportToExcel: (data: any, filename: string) => Promise<any>

      // Print
      generateSlipPDF: (feeId: number, template?: string) => Promise<any>
      printSlip: (feeId: number) => Promise<any>
      previewSlip: (feeId: number) => Promise<any>

      // Dashboard
      getDashboardStats: () => Promise<any>

      // Settings
      getSettings: () => Promise<any>
      updateSettings: (settings: any) => Promise<any>

      // Notifications
      onNotification: (callback: (message: string, type: string) => void) => void
    }
  }
}
