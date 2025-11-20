const express = require('express');
const router = express.Router();
const PermissionController = require('../../src/interfaces/controllers/PermissionController');
const PermissionRequests = require('../../src/interfaces/requests/permissionRequests');
const PermissionSchema = require('../../src/interfaces/schemas/Permission');
const authMiddleware = require('../../src/interfaces/middlewares/auth');
const { i18nMiddleware } = require('../../config/i18n');

router.use(i18nMiddleware);

router.get('/', PermissionController.index);
router.get('/show/:id', PermissionController.show);
router.get('/create', PermissionController.create);
router.post('/store', PermissionRequests(PermissionSchema.store()), PermissionController.store);
router.get('/edit/:id', PermissionController.edit);
router.patch('/update/:id', PermissionRequests(PermissionSchema.update()), PermissionController.update);
router.delete('/delete/:id', PermissionController.delete);

module.exports = router;