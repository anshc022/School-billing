// Example implementation of PDF generation
// This shows how to implement the actual PDF generation with pdfkit

import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function generateFeeSlipPDF(
  feeId: number,
  outputPath: string,
  template: 'compact' | 'full' = 'full'
): Promise<string> {
  // Fetch fee and student data
  const fee = await prisma.fee.findUnique({
    where: { id: feeId },
    include: { student: true },
  })

  if (!fee) {
    throw new Error('Fee record not found')
  }

  // Create PDF document
  const doc = new PDFDocument({
    size: template === 'compact' ? 'A5' : 'A4',
    margin: template === 'compact' ? 20 : 50,
  })

  // Pipe to file
  const filePath = path.join(outputPath, `fee-slip-${fee.receiptId}.pdf`)
  doc.pipe(fs.createWriteStream(filePath))

  // Header
  doc.fontSize(20).font('Helvetica-Bold').text('SCHOOL BILLING SYSTEM', { align: 'center' })
  doc.fontSize(10).text('Student Fee Receipt', { align: 'center' })
  doc.moveTo(50, doc.y).lineTo(500, doc.y).stroke()

  // Receipt info
  doc.fontSize(10).font('Helvetica')
  doc.text(`Receipt ID: ${fee.receiptId}`, 50, doc.y + 20)
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 250, doc.y - 15)

  // Student details
  doc.fontSize(12).font('Helvetica-Bold').text('Student Information', { underline: true })
  doc.fontSize(10).font('Helvetica')
  doc.text(`Name: ${fee.student.name}`)
  doc.text(`Class: ${fee.student.class}`)
  doc.text(`Roll No: ${fee.student.rollNo}`)
  doc.text(`Parent: ${fee.student.parentName}`)

  // Fee details
  doc.fontSize(12).font('Helvetica-Bold').text('Fee Details', { underline: true })
  doc.fontSize(10).font('Helvetica')
  doc.text(`Month: ${getMonthName(fee.month)} ${fee.year}`)
  doc.text(`Amount: ₹${fee.amount / 100}`)
  doc.text(`Status: ${fee.status.toUpperCase()}`)
  doc.text(`Payment Method: ${fee.paymentMethod || 'N/A'}`)

  // QR Code placeholder
  doc.fontSize(12).font('Helvetica-Bold').text('QR Code:', { underline: true })
  doc.rect(50, doc.y + 10, 100, 100).stroke()
  doc.fontSize(8).text('[QR Code Placeholder]', 75, doc.y + 40, { align: 'center' })

  // Footer
  doc.fontSize(8).text('This is a system-generated receipt. No signature required.', {
    align: 'center',
  })

  // Finalize
  doc.end()

  return filePath
}

function getMonthName(month: number): string {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return months[month - 1] || 'Invalid'
}