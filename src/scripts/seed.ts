import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.fee.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.user.deleteMany({});

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      passwordHash: adminPassword,
      role: 'admin',
    },
  });
  console.log('✅ Admin user created:', admin.username);

  // Create students
  const students = await Promise.all([
    prisma.student.create({
      data: {
        name: 'Rahul Kumar',
        class: '10',
        section: 'A',
        rollNo: '001',
        parentName: 'Rajesh Kumar',
        phone: '9876543210',
        address: '123 Main St, Delhi',
      },
    }),
    prisma.student.create({
      data: {
        name: 'Priya Singh',
        class: '10',
        section: 'B',
        rollNo: '002',
        parentName: 'Vikram Singh',
        phone: '9876543211',
        address: '456 Park Ave, Mumbai',
      },
    }),
    prisma.student.create({
      data: {
        name: 'Amit Patel',
        class: '9',
        section: 'A',
        rollNo: '003',
        parentName: 'Suresh Patel',
        phone: '9876543212',
        address: '789 Oak Rd, Bangalore',
      },
    }),
    prisma.student.create({
      data: {
        name: 'Neha Verma',
        class: '9',
        section: 'B',
        rollNo: '004',
        parentName: 'Arun Verma',
        phone: '9876543213',
        address: '321 Elm St, Hyderabad',
      },
    }),
    prisma.student.create({
      data: {
        name: 'Vikram Dubey',
        class: '8',
        section: 'A',
        rollNo: '005',
        parentName: 'Manoj Dubey',
        phone: '9876543214',
        address: '654 Pine Ave, Pune',
      },
    }),
  ]);
  console.log(`✅ ${students.length} students created`);

  // Create fees for students
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentYear = currentDate.getFullYear();

  const fees = [];
  for (const student of students) {
    // January fees
    fees.push(
      prisma.fee.create({
        data: {
          studentId: student.id,
          month: 1,
          year: currentYear,
          amount: 50000, // ₹500 in paise
          status: Math.random() > 0.5 ? 'paid' : 'unpaid',
          paymentMethod: 'cash',
          date: new Date('2024-01-15'),
          receiptId: `RCPT-20240115-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        },
      })
    );

    // February fees
    fees.push(
      prisma.fee.create({
        data: {
          studentId: student.id,
          month: 2,
          year: currentYear,
          amount: 50000,
          status: 'unpaid',
          paymentMethod: null,
          receiptId: `RCPT-20240215-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        },
      })
    );
  }

  await Promise.all(fees);
  console.log(`✅ ${fees.length} fee records created`);

  console.log('✨ Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
