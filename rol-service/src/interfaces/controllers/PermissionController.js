const Controller = require('./Controller');
const PermissionRepository = require('../../services/repositories/PermissionRepository');
const Permission = require('../../domain/entities/Permission');

class PermissionController extends Controller {
  constructor() {
    super();
    this.permissionRepository = new PermissionRepository();
  }

  // List all
  index = async (req, res) => {
    try {
      const result = await this.permissionRepository.getAllWithPagination(req.query);
      const items = result.data.map(doc => new Permission(doc));
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
      const exists = await this.permissionRepository.findById(id);

      if (!exists) {
        return this.sendResponse(res, req.t("messages.not_found"), [], false, 404);
      }
      const data = new Permission(exists);

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
      const exists = await this.permissionRepository.findOne({ name: req.body.name });
      if (exists) {
        return this.sendResponse(res, req.t("messages.already_exists"), [], false, 409);
      }

      const store = await this.permissionRepository.create(req.body);
      const data = new Permission(store);
      this.sendResponse(res, req.t("messages.successfully_created"), data, true, 201);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Get data for editing
  edit = async (req, res) => {
    try {
      const { id } = req.params;
      const exists = await this.permissionRepository.findById(id);
      if (!exists) {
        return this.sendResponse(res, req.t("messages.not_found"), [], false, 404);
      }
      const data = new Permission(exists);

      this.sendResponse(res, "Edit data retrieved", data);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Update
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const exists = await this.permissionRepository.findById(id);
      if (!exists) {
        return this.sendResponse(res, req.t("messages.not_found"), [], false, 404);
      }

      const updated = await this.permissionRepository.update(id, req.body);
      const data = new Permission(updated);
      this.sendResponse(res, req.t("messages.successfully_updated"), data);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Delete
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      // const exists = await this.permissionRepository.findById(id);
      // if (!exists) {
      //   return this.sendResponse(res, 'Not found', [], false, 404);
      // }

      const deleted = await this.permissionRepository.delete(id);
      if (!deleted) {
        return this.sendResponse(res, req.t("messages.not_found"), [], false, 404);
      }

      this.sendResponse(res, req.t("messages.successfully_deleted"));
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

}

module.exports = new PermissionController();