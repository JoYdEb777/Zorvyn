const recordService = require('../services/recordService');

// POST /api/records
exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, createdBy: req.user._id };
    const record = await recordService.create(data);

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// GET /api/records
exports.getAll = async (req, res, next) => {
  try {
    const result = await recordService.getAll(req.query);

    res.json({
      success: true,
      data: result.records,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/records/:id
exports.getById = async (req, res, next) => {
  try {
    const record = await recordService.findById(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Record not found.' },
      });
    }

    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// PUT /api/records/:id
exports.update = async (req, res, next) => {
  try {
    const record = await recordService.update(req.params.id, req.body);
    if (!record) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Record not found.' },
      });
    }

    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/records/:id
exports.remove = async (req, res, next) => {
  try {
    const record = await recordService.softDelete(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Record not found.' },
      });
    }

    res.json({ success: true, data: { message: 'Record deleted successfully.' } });
  } catch (error) {
    next(error);
  }
};
