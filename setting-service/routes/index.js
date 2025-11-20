const express = require('express');
const router = express.Router();
const SettingController = require('../src/interfaces/controllers/SettingController');
const SettingRequests = require('../src/interfaces/requests/settingRequests');
const SettingSchema = require('../src/interfaces/schemas/Setting');
const authMiddleware = require('../src/interfaces/middlewares/auth');
const { i18nMiddleware } = require('../config/i18n');

router.use(i18nMiddleware);

router.get('/', SettingController.index);
router.get('/all', SettingController.grouped);
router.get('/show/:id', SettingController.show);
router.get('/show-key/:key', SettingController.showByKey);
router.get('/show-group/:group', SettingController.showByGroup);
router.get('/create', SettingController.create);
router.post('/store', SettingRequests(SettingSchema.store()), SettingController.store);
router.get('/edit/:id', SettingController.edit);
router.put('/update/:key', SettingRequests(SettingSchema.update()), SettingController.update);
router.delete('/delete/:id', SettingController.delete);

module.exports = router;