// Quick seed script
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  try {
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
    console.log('✅ Admin user created');

    // Real-world student data
    const studentData = [
      { name: 'Aarav Sharma', class: '10', section: 'A', rollNo: '101', parentName: 'Vijay Sharma', phone: '9876543210', address: '12, Civil Lines, Delhi' },
      { name: 'Vivaan Gupta', class: '10', section: 'A', rollNo: '102', parentName: 'Sanjay Gupta', phone: '9876543211', address: '45, Karol Bagh, Delhi' },
      { name: 'Aditya Singh', class: '10', section: 'B', rollNo: '103', parentName: 'Manoj Singh', phone: '9876543212', address: '78, Lajpat Nagar, Delhi' },
      { name: 'Vihaan Kumar', class: '9', section: 'A', rollNo: '201', parentName: 'Rakesh Kumar', phone: '9876543213', address: '34, Rohini, Delhi' },
      { name: 'Arjun Mishra', class: '9', section: 'B', rollNo: '202', parentName: 'Alok Mishra', phone: '9876543214', address: '56, Pitampura, Delhi' },
      { name: 'Sai Patel', class: '8', section: 'A', rollNo: '301', parentName: 'Jignesh Patel', phone: '9876543215', address: '89, Dwarka, Delhi' },
      { name: 'Reyansh Reddy', class: '8', section: 'A', rollNo: '302', parentName: 'Venkatesh Reddy', phone: '9876543216', address: '23, Vasant Kunj, Delhi' },
      { name: 'Ayaan Khan', class: '7', section: 'A', rollNo: '401', parentName: 'Imran Khan', phone: '9876543217', address: '67, Okhla, Delhi' },
      { name: 'Ishaan Malhotra', class: '7', section: 'B', rollNo: '402', parentName: 'Rajiv Malhotra', phone: '9876543218', address: '90, Greater Kailash, Delhi' },
      { name: 'Krishna Joshi', class: '6', section: 'A', rollNo: '501', parentName: 'Deepak Joshi', phone: '9876543219', address: '12, Saket, Delhi' },
    ];

    const students = [];
    for (const data of studentData) {
      const student = await prisma.student.create({ data });
      students.push(student);
    }
    console.log(`✅ ${students.length} students created`);

    // Create fees for the current academic year (April 2024 - March 2025)
    // Let's assume current month is November 2024
    const months = [4, 5, 6, 7, 8, 9, 10, 11]; // April to November
    const year = 2024;
    const monthlyFee = 2500;

    const fees = [];
    
    for (const student of students) {
      for (const month of months) {
        // Force all fees to be unpaid for testing
        let status = 'unpaid';
        let paymentMethod = null;
        let date = null;

        fees.push(
          prisma.fee.create({
            data: {
              studentId: student.id,
              month: month,
              year: year,
              amount: monthlyFee,
              status: status,
              paymentMethod: paymentMethod,
              date: date,
              receiptId: `RCPT-${year}${month.toString().padStart(2, '0')}-${student.rollNo}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            },
          })
        );
      }
    }

    await Promise.all(fees);
    console.log(`✅ ${fees.length} fee records created`);
    console.log('✨ Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
