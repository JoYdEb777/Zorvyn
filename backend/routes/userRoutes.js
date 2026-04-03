const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const validate = require('../middleware/validate');
const { updateRoleSchema, updateStatusSchema } = require('../validators/userValidator');

// All user routes require admin access
router.use(auth, rbac('admin'));

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id/role', validate(updateRoleSchema), userController.updateRole);
router.put('/:id/status', validate(updateStatusSchema), userController.updateStatus);
router.delete('/:id', userController.deleteUser);

module.exports = router;
