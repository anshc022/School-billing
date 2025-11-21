import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

const prisma = new PrismaClient()

export async function initializeDatabase() {
  try {
    // Ensure database directory exists
    const dbDir = path.join(process.cwd(), 'database')
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
    }

    // Run migrations
    await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON')

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}

export { prisma }
