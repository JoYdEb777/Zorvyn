const User = require('../models/User');

class UserService {
  async createUser(data) {
    const user = await User.create(data);
    return user;
  }

  async findByEmail(email) {
    return await User.findOne({ email }).select('+password');
  }

  async findById(id) {
    return await User.findById(id);
  }

  async getAllUsers({ page: rawPage = 1, limit: rawLimit = 20 }) {
    const page = parseInt(rawPage, 10) || 1;
    const limit = parseInt(rawLimit, 10) || 20;
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateRole(id, role) {
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );
    return user;
  }

  async updateStatus(id, status) {
    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    return user;
  }

  async deleteUser(id) {
    const user = await User.findByIdAndDelete(id);
    return user;
  }
}

module.exports = new UserService();
