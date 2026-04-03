const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const validate = require('../middleware/validate');
const { createRecordSchema, updateRecordSchema } = require('../validators/recordValidator');

// All record routes require authentication
router.use(auth);

// Admin + Analyst can read
router.get('/', rbac('admin', 'analyst'), recordController.getAll);
router.get('/:id', rbac('admin', 'analyst'), recordController.getById);

// Only Admin can create/update/delete
router.post('/', rbac('admin'), validate(createRecordSchema), recordController.create);
router.put('/:id', rbac('admin'), validate(updateRecordSchema), recordController.update);
router.delete('/:id', rbac('admin'), recordController.remove);

module.exports = router;
