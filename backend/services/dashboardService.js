const Record = require('../models/Record');

class DashboardService {
  async getSummary() {
    const result = await Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = { totalIncome: 0, totalExpense: 0, netBalance: 0, totalRecords: 0 };
    result.forEach((item) => {
      if (item._id === 'income') {
        summary.totalIncome = item.total;
        summary.totalRecords += item.count;
      } else if (item._id === 'expense') {
        summary.totalExpense = item.total;
        summary.totalRecords += item.count;
      }
    });
    summary.netBalance = summary.totalIncome - summary.totalExpense;

    return summary;
  }

  async getCategoryBreakdown() {
    const result = await Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const income = [];
    const expense = [];

    result.forEach((item) => {
      const entry = { category: item._id.category, total: item.total, count: item.count };
      if (item._id.type === 'income') income.push(entry);
      else expense.push(entry);
    });

    return { income, expense };
  }

  async getTrends() {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const result = await Record.aggregate([
      {
        $match: {
          isDeleted: false,
          date: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Build structured monthly data
    const months = {};
    result.forEach((item) => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
      if (!months[key]) {
        months[key] = { month: key, income: 0, expense: 0 };
      }
      months[key][item._id.type] = item.total;
    });

    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  }

  async getRecent(limit = 10) {
    const records = await Record.find({ isDeleted: false })
      .populate('createdBy', 'name email')
      .sort({ date: -1 })
      .limit(limit);

    return records;
  }
}

module.exports = new DashboardService();
