const Controller = require('./Controller');
const UserRepository = require('../../services/repositories/UserRepository');
const FirebaseAuthService = require('../../services/social/FirebaseAuthService');
const AuthUseCase = require('../../application/use_cases/Auth')
const jwtService = require('../../services/jwt/jwtService');
const User = require('../../domain/entities/User');
const { setCache, getCache, deleteCache } = require('../../services/redis/cache');
const EmailSender = require('../../services/notifications/email');
const { oneSignal } = require('../../../config/email');

class AuthController extends Controller {
  constructor(userRepository = new UserRepository(), firebaseAuthService = new FirebaseAuthService()) {
    super();
    this.authUseCase = new AuthUseCase({ userRepository, firebaseAuthService });
    this.userRepo = userRepository;
  }

  auth = async (req, res) => {
    const { email, password } = req.body;

    try {
      const result = await this.authUseCase.auth(email, password);

      if (!result.success) {
        return this.sendResponse(res, result.message, null, false);
      }
      const data = new User(result.data);
      const payload = { userId: data.id, email: data.email, roles: data.roles };
      const token = jwtService.generateToken(payload);
      this.sendResponse(res, req.t("messages.successful_login"), {
        ...data,
        token: token,
      });
    } catch (error) {
      this.sendError(res, error.message);
    }
  }

  authSocial = async (req, res) => {
    const { socialToken } = req.body;
    const { provider } = req.params;

    try {
      const result = await this.authUseCase.authSocial(socialToken, provider);
      const data = new User(result);

      const payload = { userId: data.id, email: data.email, roles: data.roles };
      const token = jwtService.generateToken(payload);
      this.sendResponse(res, req.t("messages.successful_login"), {
        ...data,
        token: token,
      });
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  register = async (req, res) => {
    const body = req.body;

    try {
      const result = await this.authUseCase.register(body);
      if (!result.success) {
        return this.sendResponse(res, result.message, null, false);
      }
      const data = new User(result.data);
      this.sendResponse(res, req.t("messages.successfully_registered"), data);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  sendVerificationCode = async (req, res) => {
    let { email, code } = req.body;
    try {

      if (!code) {
        code = Math.floor(100000 + Math.random() * 900000); // Código de 6 dígitos
      }
      console.log(code);
      const ttl = 60 * 20; // 20 minutos

      await setCache(`email:${email}`, code, ttl);
      const emailSender = new EmailSender({
        oneSignalAppId: oneSignal.appId,
        oneSignalApiKey: oneSignal.apiKey
      });

      await emailSender.sendEmail({ toEmail: email, subject: 'Verify your email', template: 'emailVerification.html', variables: { "CODE": code } });

      this.sendResponse(res, "Code sent to email");
    } catch (error) {
      this.sendError(res, error.message);
    }
  }

  verifyAccount = async (req, res) => {
    let { email, code } = req.body;

    try {
      // let exists = await this.userRepo.findByEmail(email);

      // if (!exists) {
      //   return this.sendResponse(res, req.t("messages.not_found"), null, false, 409);
      // }

      const cacheKey = `email:${email}`;
      let cached = await getCache(cacheKey)

      if (!cached) {
        return this.sendError(res, 'Expired code', 404);
      }
      if (cached != code) {
        return this.sendError(res, 'Invalid code', 404);
      }

      await deleteCache(cacheKey);
      // const user = new User(exists)
      // await this.authUseCase.verifyEmail(user.id);

      this.sendResponse(res, "Verified email");
    } catch (error) {
      this.sendError(res, error.message);
    }
  }

  forgotPassword = async (req, res) => {
    let { email, code } = req.body;
    try {
      if (!code) {
        code = Math.floor(100000 + Math.random() * 900000); // Código de 6 dígitos
      }
      const ttl = 60 * 20; // 20 minutos

      await setCache(`email:${email}`, code, ttl);

      const emailSender = new EmailSender({
        oneSignalAppId: oneSignal.appId,
        oneSignalApiKey: oneSignal.apiKey
      });

      await emailSender.sendEmail({ toEmail: email, subject: 'Forgot Password', template: 'passwordReset.html', variables: { "CODE": code } });

      this.sendResponse(res, "Code sent to email");
    } catch (error) {
      this.sendError(res, error.message);
    }
  }

  resetPassword = async (req, res) => {
    const { email, code, password } = req.body;

    try {
      let exists = await this.userRepo.findByEmail(email);

      if (!exists) {
        return this.sendResponse(res, req.t("messages.not_found"), null, false, 409);
      }

      const cacheKey = `email:${email}`;
      let cached = await getCache(cacheKey)

      if (!cached) {
        return this.sendError(res, 'Expired code', 404);
      }
      if (cached != code) {
        return this.sendError(res, 'Invalid code', 404);
      }

      const user = new User(exists)

      await this.authUseCase.resetPassword(user.id, user.email, password);

      await deleteCache(cacheKey);

      this.sendResponse(res, "Password reset");
    } catch (error) {
      this.sendError(res, error.message);
    }
  }
}

module.exports = new AuthController();