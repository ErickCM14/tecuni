const Controller = require('./Controller');
const RolRepository = require('../../services/repositories/RolRepository');
const Rol = require('../../domain/entities/Rol');

class RolController extends Controller {
  constructor() {
    super();
    this.rolRepository = new RolRepository();
  }

  // List all
  index = async (req, res) => {
    try {
      const result = await this.rolRepository.getAllWithPagination(req.query);
      const items = result.data.map(doc => new Rol(doc));
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
      const exists = await this.rolRepository.findById(id);

      if (!exists) {
        return this.sendResponse(res, 'Not found', [], false, 404);
      }
      const data = new Rol(exists);

      this.sendResponse(res, req.t("messages.successfully_retrived"), data);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Get data needed to create
  create = async (req, res) => {
    try {
      const data = [];
      this.sendResponse(res, "Create data retrieved", data);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Store new
  store = async (req, res) => {
    try {
      const { name, description, permissions = [] } = req.body;
      const exists = await this.rolRepository.findOne({ name });
      if (exists) {
        return this.sendResponse(res, req.t("messages.already_exists"), [], false, 409);
      }
      
      const store = await this.rolRepository.create(req.body);
      if (permissions.length > 0) {
        await this.rolRepository.addToArrayField(store._id, 'permissions', permissions);
      }
      const rol = await this.rolRepository.findById(store._id);
      const data = new Rol(rol);

      this.sendResponse(res, req.t("messages.successfully_created"), data, true, 201);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Get data for editing
  edit = async (req, res) => {
    try {
      const { id } = req.params;
      const exists = await this.rolRepository.findById(id);
      if (!exists) {
        return this.sendResponse(res, req.t("messages.not_found"), [], false, 404);
      }
      const data = new Rol(exists);

      this.sendResponse(res, "Edit data retrieved", data);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Update
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const exists = await this.rolRepository.findById(id);
      if (!exists) {
        return this.sendResponse(res, req.t("messages.not_found"), [], false, 404);
      }
      
      const updated = await this.rolRepository.update(id, req.body);
      const { permissions = [] } = req.body;
      if (permissions.length > 0) {
        await this.rolRepository.addToArrayField(updated._id, 'permissions', permissions);
      }
      const rol = await this.rolRepository.findById(updated._id);
      const data = new Rol(rol);

      this.sendResponse(res, req.t("messages.successfully_updated"), data);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Delete
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      // const exists = await this.rolRepository.findById(id);
      // if (!exists) {
      //   return this.sendResponse(res, 'Not found', [], false, 404);
      // }

      const deleted = await this.rolRepository.delete(id);
      if (!deleted) {
        return this.sendResponse(res, req.t("messages.not_found"), [], false, 404);
      }

      this.sendResponse(res, req.t("messages.successfully_deleted"));
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

}

module.exports = new RolController();