const express = require('express');
const router = express.Router();
const AuthController = require('../src/interfaces/controllers/AuthController');
const AuthRequests = require('../src/interfaces/requests/authRequests');
const AuthSchema = require('../src/interfaces/schemas/Auth');
const authMiddleware = require('../src/interfaces/middlewares/auth');
const { i18nMiddleware } = require('../config/i18n');

router.use(i18nMiddleware);

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
  next()
});
router.get('/ping', (req, res) => res.send('pong'));
router.post('/login', AuthRequests(AuthSchema.login()), AuthController.auth);

router.post('/login/:provider', AuthRequests(AuthSchema.loginSocial()), AuthController.authSocial);

router.post('/register', AuthRequests(AuthSchema.register()), AuthController.register);
router.post('/forgot-password', AuthRequests(AuthSchema.forgotPassword()), AuthController.forgotPassword);
router.post('/reset-password', AuthRequests(AuthSchema.resetPassword()), AuthController.resetPassword);
router.post('/send-verification-code', AuthRequests(AuthSchema.sendVerificationCode()), AuthController.sendVerificationCode);
router.post('/verify-account', AuthRequests(AuthSchema.verifyAccount()), AuthController.verifyAccount);

module.exports = router;