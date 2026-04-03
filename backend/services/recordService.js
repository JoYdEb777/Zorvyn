const Record = require('../models/Record');

class RecordService {
  async create(data) {
    const record = await Record.create(data);
    return record;
  }

  async findById(id) {
    return await Record.findOne({ _id: id, isDeleted: false }).populate(
      'createdBy',
      'name email'
    );
  }

  async getAll(filters = {}) {
    const {
      type,
      category,
      from,
      to,
      search,
      page: rawPage = 1,
      limit: rawLimit = 20,
      sort = 'date',
      order = 'desc',
    } = filters;

    const page = parseInt(rawPage, 10) || 1;
    const limit = parseInt(rawLimit, 10) || 20;

    const query = { isDeleted: false };

    if (type) query.type = type;
    if (category) query.category = { $regex: category, $options: 'i' };
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) {
        const endOfDay = new Date(to);
        endOfDay.setHours(23, 59, 59, 999);
        query.date.$lte = endOfDay;
      }
    }
    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const sortObj = { [sort]: order === 'asc' ? 1 : -1 };

    const [records, total] = await Promise.all([
      Record.find(query)
        .populate('createdBy', 'name email')
        .sort(sortObj)
        .skip(skip)
        .limit(limit),
      Record.countDocuments(query),
    ]);

    return {
      records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async update(id, data) {
    const record = await Record.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true, runValidators: true, timestamps: true }
    ).populate('createdBy', 'name email');
    return record;
  }

  async softDelete(id) {
    const record = await Record.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true, timestamps: true }
    );
    return record;
  }
}

module.exports = new RecordService();
