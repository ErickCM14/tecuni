const Controller = require('./Controller');
const UserRepository = require('../../services/repositories/UserRepository');
// const {
//   CreateUserUseCase,
//   UpdateUserUseCase,
//   DeleteUserUseCase
// } = require('../../application/use_cases/User');
const User = require('../../domain/entities/User');
const PasswordHelper = require('../../utils/passwordHelper');

class UserController extends Controller {
  constructor() {
    super();
    this.userRepository = new UserRepository();
    this.passwordHelper = new PasswordHelper();

    // this.createUserUseCase = new CreateUserUseCase(this.userRepository);
    // this.updateUserUseCase = new UpdateUserUseCase(this.userRepository);
    // this.deleteUserUseCase = new DeleteUserUseCase(this.userRepository);
  }

  // List all
  index = async (req, res) => {
    try {
      // const result = await this.userRepository.findAll();
      const result = await this.userRepository.getAllWithPagination(req.query);
      console.log(req.user);
      
      const items = result.data.map(doc => new User(doc));
      this.sendResponse(res, req.t("messages.successfully_retrived"), {
        items,
        pagination: result.pagination
      });
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Show by ID
  show = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.userRepository.findById(id);

      if (!result) {
        return this.sendResponse(res, 'Not found', null, false, 404);
      }
      const data = new User(result);
      this.sendResponse(res, req.t("messages.successfully_retrived"), data);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Get data needed to create
  create = async (req, res) => {
    try {
      const data = [];
      // const data = await this.userRepository.getCreateMetadata();
      this.sendResponse(res, "Create data retrieved", data);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Store new
  store = async (req, res) => {
    try {
      const exists = await this.userRepository.findByUsername(req.body.username);
      if (exists) {
        return this.sendResponse(res, req.t("messages.already_exists"), null, false, 409);
      }
      const existsEmail = await this.userRepository.findByEmail(req.body.email);
      if (existsEmail) {
        return this.sendResponse(res, req.t("messages.already_exists"), null, false, 409);
      }

      const { password, roles = [] } = req.body;
      req.body.password = await this.passwordHelper.hashPassword(password);
      req.body.active = 1;
      req.body.terms = true;

      const store = await this.userRepository.create(req.body);
      if (roles.length > 0) {
        await this.userRepository.addToArrayField(store._id, 'roles', roles);
      }
      const user = await this.userRepository.findById(store._id);
      const data = new User(user);
      this.sendResponse(res, req.t("messages.successfully_created"), data, true, 201);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Get data for editing
  edit = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await this.userRepository.findById(id);
      if (!user) {
        return this.sendResponse(res, req.t("messages.not_found"), null, false, 404);
      }

      const data = new User(user);
      this.sendResponse(res, "Edit data retrieved", data);
      // const metadata = await this.userRepository.getEditMetadata(id);
      // this.sendResponse(res, "Edit data retrieved", metadata);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Update
  update = async (req, res) => {
    try {
      // const result = this.updateUserUseCase.execute(req.body);

      // if (!result.success) {
      //   return this.sendResponse(res, result.message, null, false, result.status);
      // }

      const { id } = req.params;
      const user = await this.userRepository.findById(id);
      if (!user) {
        return this.sendResponse(res, req.t("messages.not_found"), null, false, 404);
      }

      const { password } = req.body;
      if (password) {
        req.body.password = await this.passwordHelper.hashPassword(password);
      }

      const updated = await this.userRepository.update(id, req.body);
      const data = new User(updated);
      this.sendResponse(res, req.t("messages.successfully_updated"), data);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Delete
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      // const result = this.deleteUserUseCase.execute({ id });
      // if (!result.success) {
      //   return this.sendResponse(res, result.message, null, false, result.status);
      // }

      const deleted = await this.userRepository.delete(id);

      if (!deleted) {
        return this.sendResponse(res, req.t("messages.not_found"), null, false, 404);
      }

      this.sendResponse(res, req.t("messages.successfully_deleted"));
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

}

module.exports = new UserController();