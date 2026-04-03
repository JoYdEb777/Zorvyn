const userService = require('../services/userService');

// GET /api/users
exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await userService.getAllUsers({ page, limit });

    res.json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/:id
exports.getById = async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found.' },
      });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id/role
exports.updateRole = async (req, res, next) => {
  try {
    // Prevent admin from changing own role
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: 'You cannot change your own role.' },
      });
    }

    const user = await userService.updateRole(req.params.id, req.body.role);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found.' },
      });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id/status
exports.updateStatus = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: 'You cannot deactivate your own account.' },
      });
    }

    const user = await userService.updateStatus(req.params.id, req.body.status);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found.' },
      });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: 'You cannot delete your own account.' },
      });
    }

    const user = await userService.deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found.' },
      });
    }

    res.json({ success: true, data: { message: 'User deleted successfully.' } });
  } catch (error) {
    next(error);
  }
};
