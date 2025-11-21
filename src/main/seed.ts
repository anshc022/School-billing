import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { generateReceiptId } from './utils'

const prisma = new PrismaClient()

async function seed() {
  console.log('🌱 Seeding database...')

  try {
    // Clear existing data
    await prisma.fee.deleteMany()
    await prisma.student.deleteMany()
    await prisma.user.deleteMany()

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const user = await prisma.user.create({
      data: {
        username: 'admin',
        passwordHash: hashedPassword,
        role: 'admin',
      },
    })
    console.log('✓ Created admin user')

    // Create sample students
    const students = await Promise.all([
      prisma.student.create({
        data: {
          name: 'Rahul Kumar',
          class: '10-A',
          section: 'Science',
          rollNo: '001',
          parentName: 'Mr. Kumar',
          phone: '9876543210',
          address: '123 Main St, Delhi',
        },
      }),
      prisma.student.create({
        data: {
          name: 'Priya Singh',
          class: '10-B',
          section: 'Commerce',
          rollNo: '002',
          parentName: 'Mr. Singh',
          phone: '9876543211',
          address: '456 Park Rd, Mumbai',
        },
      }),
      prisma.student.create({
        data: {
          name: 'Amit Patel',
          class: '9-A',
          section: 'Science',
          rollNo: '003',
          parentName: 'Mr. Patel',
          phone: '9876543212',
          address: '789 Oak Ave, Bangalore',
        },
      }),
      prisma.student.create({
        data: {
          name: 'Neha Verma',
          class: '9-B',
          section: 'Arts',
          rollNo: '004',
          parentName: 'Mrs. Verma',
          phone: '9876543213',
          address: '321 Elm St, Chennai',
        },
      }),
      prisma.student.create({
        data: {
          name: 'Vikram Dubey',
          class: '8-A',
          section: 'General',
          rollNo: '005',
          parentName: 'Mr. Dubey',
          phone: '9876543214',
          address: '654 Birch Ln, Pune',
        },
      }),
    ])
    console.log(`✓ Created ${students.length} students`)

    // Create sample fee records
    const fees = []
    for (let i = 0; i < students.length; i++) {
      for (let month = 1; month <= 2; month++) {
        const fee = await prisma.fee.create({
          data: {
            studentId: students[i].id,
            month,
            year: 2024,
            amount: 50000, // ₹500
            status: month === 1 ? 'paid' : 'unpaid',
            paymentMethod: month === 1 ? 'online' : null,
            date: month === 1 ? new Date() : null,
            receiptId: generateReceiptId(),
          },
        })
        fees.push(fee)
      }
    }
    console.log(`✓ Created ${fees.length} fee records`)

    console.log('✅ Database seeded successfully!')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seed()
