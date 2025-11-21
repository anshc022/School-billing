import { ipcMain, BrowserWindow } from 'electron'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { generateReceiptId } from './utils'

const prisma = new PrismaClient()

// Auth IPC handlers
export const handleAuthOps = () => {
  ipcMain.handle('auth:login', async (_event, { username, password }) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
      })

      if (!user) {
        return { success: false, error: 'Invalid credentials' }
      }

      const isValid = await bcrypt.compare(password, user.passwordHash)
      if (!isValid) {
        return { success: false, error: 'Invalid credentials' }
      }

      return { success: true, user: { id: user.id, username: user.username, role: user.role } }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('auth:logout', async () => {
    return { success: true }
  })
}

// Student IPC handlers
export const handleStudentOps = () => {
  ipcMain.handle('students:list', async () => {
    try {
      const students = await prisma.student.findMany({
        orderBy: { createdAt: 'desc' },
      })
      return { success: true, data: students }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('students:get', async (_event, { id }) => {
    try {
      const student = await prisma.student.findUnique({
        where: { id: parseInt(id) },
        include: { fees: true },
      })
      return { success: true, data: student }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('students:create', async (_event, data) => {
    try {
      const student = await prisma.student.create({
        data: {
          name: data.name,
          class: data.class,
          section: data.section,
          rollNo: data.rollNo,
          parentName: data.parentName,
          phone: data.phone,
          address: data.address,
        },
      })
      notifyRenderer('Student created successfully', 'success')
      return { success: true, data: student }
    } catch (error) {
      notifyRenderer((error as Error).message, 'error')
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('students:update', async (_event, { id, ...data }) => {
    try {
      const student = await prisma.student.update({
        where: { id: parseInt(id) },
        data,
      })
      notifyRenderer('Student updated successfully', 'success')
      return { success: true, data: student }
    } catch (error) {
      notifyRenderer((error as Error).message, 'error')
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('students:delete', async (_event, { id }) => {
    try {
      await prisma.student.delete({
        where: { id: parseInt(id) },
      })
      notifyRenderer('Student deleted successfully', 'success')
      return { success: true }
    } catch (error) {
      notifyRenderer((error as Error).message, 'error')
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('students:search', async (_event, { query, filters }) => {
    try {
      const where: any = {
        OR: [
          { name: { contains: query } },
          { parentName: { contains: query } },
          { rollNo: { contains: query } },
        ],
      }

      if (filters?.class) {
        where.class = filters.class
      }

      const students = await prisma.student.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      })
      return { success: true, data: students }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('students:getByRollNo', async (_event, { rollNo }) => {
    try {
      const student = await prisma.student.findFirst({
        where: { rollNo: rollNo },
        include: {
          fees: {
            orderBy: { createdAt: 'desc' }
          }
        },
      })
      
      if (!student) {
        return { success: false, error: 'Student not found' }
      }
      
      return { success: true, data: student }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })
}

// Fee IPC handlers
export const handleFeeOps = () => {
  ipcMain.handle('fees:list', async () => {
    try {
      const fees = await prisma.fee.findMany({
        include: { student: true },
        orderBy: { createdAt: 'desc' },
      })
      return { success: true, data: fees }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('fees:getByStudent', async (_event, { studentId }) => {
    try {
      const fees = await prisma.fee.findMany({
        where: { studentId: parseInt(studentId) },
        orderBy: { createdAt: 'desc' },
      })
      return { success: true, data: fees }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('fees:create', async (_event, data) => {
    try {
      const receiptId = generateReceiptId()
      const fee = await prisma.fee.create({
        data: {
          studentId: parseInt(data.studentId),
          month: parseInt(data.month),
          year: parseInt(data.year),
          amount: parseInt(data.amount),
          status: data.status || 'unpaid',
          paymentMethod: data.paymentMethod,
          date: data.date ? new Date(data.date) : null,
          receiptId,
        },
        include: { student: true },
      })
      notifyRenderer('Fee record created successfully', 'success')
      return { success: true, data: fee }
    } catch (error) {
      notifyRenderer((error as Error).message, 'error')
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('fees:update', async (_event, { id, ...data }) => {
    try {
      const fee = await prisma.fee.update({
        where: { id: parseInt(id) },
        data: {
          status: data.status,
          paymentMethod: data.paymentMethod,
          date: data.date ? new Date(data.date) : undefined,
        },
        include: { student: true },
      })
      notifyRenderer('Fee record updated successfully', 'success')
      return { success: true, data: fee }
    } catch (error) {
      notifyRenderer((error as Error).message, 'error')
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('fees:delete', async (_event, { id }) => {
    try {
      await prisma.fee.delete({
        where: { id: parseInt(id) },
      })
      notifyRenderer('Fee record deleted successfully', 'success')
      return { success: true }
    } catch (error) {
      notifyRenderer((error as Error).message, 'error')
      return { success: false, error: (error as Error).message }
    }
  })
}

// Report IPC handlers
export const handleReportOps = () => {
  ipcMain.handle('reports:monthly', async (_event, { month, year }) => {
    try {
      const fees = await prisma.fee.findMany({
        where: {
          month: parseInt(month),
          year: parseInt(year),
        },
        include: { student: true },
        orderBy: { createdAt: 'desc' },
      })

      const totalAmount = fees.reduce((sum: number, fee: any) => sum + fee.amount, 0)
      const paidAmount = fees
        .filter((f: any) => f.status === 'paid')
        .reduce((sum: number, fee: any) => sum + fee.amount, 0)

      return {
        success: true,
        data: {
          fees,
          totalAmount,
          paidAmount,
          pendingAmount: totalAmount - paidAmount,
        },
      }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('reports:studentHistory', async (_event, { studentId }) => {
    try {
      const fees = await prisma.fee.findMany({
        where: { studentId: parseInt(studentId) },
        orderBy: { createdAt: 'desc' },
      })
      return { success: true, data: fees }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('reports:exportCSV', async (_event, { data, filename }) => {
    // CSV export logic - placeholder
    notifyRenderer('CSV export initiated', 'success')
    return { success: true }
  })

  ipcMain.handle('reports:exportExcel', async (_event, { data, filename }) => {
    // Excel export logic - placeholder
    notifyRenderer('Excel export initiated', 'success')
    return { success: true }
  })
}

// Helper to generate HTML
const generateSlipHtml = (fee: any) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Fee Receipt</title>
      <style>
        body { font-family: sans-serif; padding: 20px; background: white; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .school-name { font-size: 24px; font-weight: bold; }
        .receipt-title { font-size: 18px; margin-top: 5px; }
        .details { margin-bottom: 20px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .label { font-weight: bold; }
        .amount-box { border: 1px solid #333; padding: 10px; text-align: right; margin-top: 20px; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; }
        @media print {
          body { -webkit-print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="school-name">SCHOOL NAME</div>
        <div class="receipt-title">FEE RECEIPT</div>
      </div>
      
      <div class="details">
        <div class="row">
          <div><span class="label">Receipt No:</span> ${fee.receiptId}</div>
          <div><span class="label">Date:</span> ${fee.date ? new Date(fee.date).toLocaleDateString() : new Date().toLocaleDateString()}</div>
        </div>
        <div class="row">
          <div><span class="label">Student Name:</span> ${fee.student.name}</div>
          <div><span class="label">Roll No:</span> ${fee.student.rollNo}</div>
        </div>
        <div class="row">
          <div><span class="label">Class:</span> ${fee.student.class} - ${fee.student.section}</div>
          <div><span class="label">Father's Name:</span> ${fee.student.parentName}</div>
        </div>
        <div class="row">
          <div><span class="label">Month/Year:</span> ${new Date(0, fee.month - 1).toLocaleString('default', { month: 'long' })} ${fee.year}</div>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Description</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Tuition Fee</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${fee.amount.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Total</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">₹${fee.amount.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <div class="footer">
        <p>This is a computer generated receipt.</p>
      </div>
    </body>
    </html>
  `
}

// Print/PDF handlers
export const handlePrintOps = () => {
  ipcMain.handle('print:generatePDF', async (_event, { feeId }) => {
    // PDF generation logic - placeholder
    return { success: true, path: `/tmp/fee-slip-${feeId}.pdf` }
  })

  ipcMain.handle('print:printSlip', async (_event, { feeId }) => {
    try {
      const fee = await prisma.fee.findUnique({
        where: { id: parseInt(feeId) },
        include: { student: true }
      })

      if (!fee) {
        throw new Error('Fee record not found')
      }

      // Create a window for printing
      let printWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      })

      const htmlContent = generateSlipHtml(fee)
      
      // Add auto-print script
      const htmlWithScript = htmlContent.replace('</body>', `
        <script>
          window.onload = () => {
            window.print();
            // Optional: Close window after print (might need IPC to communicate back)
          }
        </script>
        </body>
      `)

      // Load the HTML
      printWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlWithScript))

      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('print:previewSlip', async (_event, { feeId }) => {
    try {
      const fee = await prisma.fee.findUnique({
        where: { id: parseInt(feeId) },
        include: { student: true }
      })

      if (!fee) {
        throw new Error('Fee record not found')
      }

      const htmlContent = generateSlipHtml(fee)
      return { success: true, html: htmlContent }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('dashboard:stats', async () => {
    try {
      const totalStudents = await prisma.student.count()
      const totalFees = await prisma.fee.count()
      const paidFees = await prisma.fee.count({ where: { status: 'paid' } })

      const fees = await prisma.fee.findMany()
      const totalAmount = fees.reduce((sum: number, fee: any) => sum + fee.amount, 0)
      const paidAmount = fees
        .filter((f: any) => f.status === 'paid')
        .reduce((sum: number, fee: any) => sum + fee.amount, 0)

      return {
        success: true,
        data: {
          totalStudents,
          totalFees,
          paidFees,
          totalAmount,
          paidAmount,
          pendingAmount: totalAmount - paidAmount,
        },
      }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('settings:get', async () => {
    return {
      success: true,
      data: {
        schoolName: 'Your School Name',
        currency: 'INR',
        darkMode: false,
      },
    }
  })

  ipcMain.handle('settings:update', async (_event, settings) => {
    // Settings update logic - placeholder
    notifyRenderer('Settings updated successfully', 'success')
    return { success: true, data: settings }
  })
}

// Helper function to notify renderer
function notifyRenderer(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const mainWindow = BrowserWindow.getAllWindows()[0]
  if (mainWindow) {
    mainWindow.webContents.send('notification', message, type)
  }
}
