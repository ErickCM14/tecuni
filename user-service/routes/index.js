const express = require('express');
const router = express.Router();
const UserController = require('../src/interfaces/controllers/UserController');
const UserRequests = require('../src/interfaces/requests/userRequests');
const UserSchema = require('../src/interfaces/schemas/User');
const authMiddleware = require('../src/interfaces/middlewares/auth');
const headersMiddleware = require('../src/interfaces/middlewares/headers');
const { i18nMiddleware } = require('../config/i18n');

router.use(i18nMiddleware);

router.get('/', headersMiddleware, UserController.index);
router.get('/show/:id', UserController.show);
router.get('/create', UserController.create);
// router.post('/store', UserRequests.create(), UserController.store);
router.post('/store', UserRequests(UserSchema.create()), UserController.store);
router.get('/edit/:id', UserController.edit);
// router.patch('/update/:id', UserRequests.update(), UserController.update);
router.patch('/update/:id', UserRequests(UserSchema.update()), UserController.update);
router.delete('/delete/:id', UserController.delete);

module.exports = router;