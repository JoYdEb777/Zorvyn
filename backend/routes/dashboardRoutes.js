const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

// All dashboard routes require authentication
router.use(auth);

// Everyone can see summary and recent
router.get('/summary', dashboardController.summary);
router.get('/recent', dashboardController.recent);

// Only Analyst + Admin for deeper analytics
router.get('/category-breakdown', rbac('admin', 'analyst'), dashboardController.categoryBreakdown);
router.get('/trends', rbac('admin', 'analyst'), dashboardController.trends);

module.exports = router;
