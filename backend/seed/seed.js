require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Record = require('../models/Record');
const connectDB = require('../config/db');

const categoryDescriptions = {
  income: {
    Salary: ['Monthly salary deposit', 'Annual salary increment payout', 'Salary advance received'],
    Freelance: ['Freelance web development project', 'Contract payment milestone', 'Freelance design work'],
    Investments: ['Stock dividend payment', 'Mutual fund returns', 'Investment maturity payout'],
    'Rental Income': ['Rental income from property', 'Monthly tenant rent', 'Property lease payment'],
    Bonus: ['Q1 performance bonus', 'Annual profit sharing', 'Referral bonus'],
    Consulting: ['Consulting fee for strategy review', 'Client retainer fee', 'Consulting project delivery'],
  },
  expense: {
    Rent: ['Office rent — downtown', 'Co-working space membership', 'Warehouse rent payment'],
    Utilities: ['Electricity and internet bill', 'Water and gas bill', 'Phone bill payment'],
    Software: ['AWS hosting + SaaS tools', 'Slack and Notion subscriptions', 'Cloud storage renewal'],
    Marketing: ['Google Ads campaign spend', 'Social media marketing agency', 'Brand promotion materials'],
    Salaries: ['Employee payroll — March', 'Contractor payment', 'Intern stipends'],
    'Office Supplies': ['Printer paper and toner', 'Stationery and supplies', 'Cleaning materials purchase'],
    Travel: ['Flight to NYC for conference', 'Hotel stay for client meeting', 'Cab expenses — team outing'],
    Insurance: ['Business insurance premium', 'Health insurance renewal', 'Equipment insurance fee'],
    Equipment: ['New laptops for dev team', 'Monitor and peripherals', 'Server hardware upgrade'],
    Training: ['Team workshop — leadership training', 'Online course subscriptions', 'Conference registration fee'],
  },
};

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(monthsBack) {
  const date = new Date();
  date.setMonth(date.getMonth() - randomBetween(0, monthsBack));
  date.setDate(randomBetween(1, 28));
  return date;
}

async function seed() {
  try {
    await connectDB();
    console.log('🌱 Starting seed...\n');

    // Clear existing data
    await User.deleteMany({});
    await Record.deleteMany({});
    console.log('🗑️  Cleared existing users and records.\n');

    // Create demo users
    const users = await User.create([
      { name: 'Admin User', email: 'admin@zorvyn.com', password: 'admin123', role: 'admin', status: 'active' },
      { name: 'Sarah Analyst', email: 'analyst@zorvyn.com', password: 'analyst123', role: 'analyst', status: 'active' },
      { name: 'Tom Viewer', email: 'viewer@zorvyn.com', password: 'viewer123', role: 'viewer', status: 'active' },
    ]);

    console.log('👤 Created demo users:');
    users.forEach((u) => console.log(`   ${u.role.padEnd(8)} → ${u.email} (password: ${u.role}123)`));
    console.log('');

    // Generate 50 financial records
    const records = [];
    const categories = {
      income: ['Salary', 'Freelance', 'Investments', 'Rental Income', 'Bonus', 'Consulting'],
      expense: ['Rent', 'Utilities', 'Software', 'Marketing', 'Salaries', 'Office Supplies', 'Travel', 'Insurance', 'Equipment', 'Training'],
    };

    for (let i = 0; i < 50; i++) {
      const type = Math.random() > 0.45 ? 'income' : 'expense'; // Slight income bias for positive balance
      const cats = categories[type];
      const category = cats[randomBetween(0, cats.length - 1)];
      const descs = categoryDescriptions[type][category];
      const description = descs[randomBetween(0, descs.length - 1)];
      const amount = type === 'income'
        ? randomBetween(1000, 25000)
        : randomBetween(200, 12000);

      records.push({
        amount,
        type,
        category,
        date: randomDate(11),
        description,
        createdBy: users[0]._id, // admin created all records
      });
    }

    await Record.insertMany(records);
    console.log(`📊 Created ${records.length} financial records.`);

    // Summary stats
    const totalIncome = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
    console.log(`   💰 Total Income:  ₹${totalIncome.toLocaleString()}`);
    console.log(`   💸 Total Expense: ₹${totalExpense.toLocaleString()}`);
    console.log(`   📈 Net Balance:   ₹${(totalIncome - totalExpense).toLocaleString()}`);

    console.log('\n✅ Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
