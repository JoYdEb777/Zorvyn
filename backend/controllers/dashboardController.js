const dashboardService = require('../services/dashboardService');

// GET /api/dashboard/summary
exports.summary = async (req, res, next) => {
  try {
    const data = await dashboardService.getSummary();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/category-breakdown
exports.categoryBreakdown = async (req, res, next) => {
  try {
    const data = await dashboardService.getCategoryBreakdown();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/trends
exports.trends = async (req, res, next) => {
  try {
    const data = await dashboardService.getTrends();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/recent
exports.recent = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const data = await dashboardService.getRecent(limit);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
