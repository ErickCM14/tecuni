const Controller = require('./Controller');
const SettingRepository = require('../../services/repositories/SettingRepository');
const Setting = require('../../domain/entities/Setting');

class SettingController extends Controller {
  constructor() {
    super();
    this.settingRepository = new SettingRepository();
  }

  // List all
  index = async (req, res) => {
    try {
      console.log(req.language);
      const result = await this.settingRepository.getAllWithPagination(req.query);
      const items = result.data.map(doc => new Setting(doc));
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
      const result = await this.settingRepository.findById(id);

      if (!result) {
        return this.sendResponse(res, req.t("messages.not_found"), null, false, 404);
      }
      const data = new Setting(result);
      this.sendResponse(res, req.t("messages.successfully_retrived"), data);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Show by Key
  showByKey = async (req, res) => {
    try {
      const { key } = req.params;
      const result = await this.settingRepository.findByKey(key);

      if (!result) {
        return this.sendResponse(res, req.t("messages.not_found"), null, false, 404);
      }
      const data = new Setting(result);
      this.sendResponse(res, req.t("messages.successfully_retrived"), data);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  showByGroup = async (req, res) => {
    try {
      const { group } = req.params;
      const settings = await this.settingRepository.findByGroup(group);

      if (!settings || settings.length === 0) {
        return this.sendResponse(res, req.t("messages.not_found"), [], true, 200);
      }

      const data = settings.map(doc => new Setting(doc));
      this.sendResponse(res, req.t("messages.successfully_retrived"), data);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Get data needed to create
  create = async (req, res) => {
    try {
      const data = [];
      // const data = await this.settingRepository.getCreateMetadata();
      this.sendResponse(res, "Create data retrieved", data);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Store new
  store = async (req, res) => {
    try {
      const exists = await this.settingRepository.findByKey(req.body.key);
      if (exists) {
        return this.sendResponse(res, req.t("messages.already_exists"), null, false, 409);
      }
      req.body.group = req.body.group || 'general';
      const store = await this.settingRepository.create(req.body);
      const data = new Setting(store);
      this.sendResponse(res, req.t("messages.successfully_created"), data, true, 201);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Get data for editing
  edit = async (req, res) => {
    try {
      const { key } = req.params;
      const edit = await this.settingRepository.findByKey(key);
      if (!edit) {
        return this.sendResponse(res, req.t("messages.not_found"), null, false, 404);
      }

      const data = new Setting(edit);
      this.sendResponse(res, "Edit data retrieved", data);
      // const metadata = await this.settingRepository.getEditMetadata(id);
      // this.sendResponse(res, "Edit data retrieved", metadata);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Update
  update = async (req, res) => {
    try {
      const { key } = req.params;
      const update = await this.settingRepository.findByKey(key);
      if (!update) {
        // return this.sendResponse(res, req.t("messages.not_found"), null, false, 404);
      }

      const updated = await this.settingRepository.updateOrCreate(key, req.body.value, req.body);
      const data = new Setting(updated);
      this.sendResponse(res, req.t("messages.successfully_updated"), data);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Delete
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.settingRepository.delete(id);

      if (!deleted) {
        return this.sendResponse(res, req.t("messages.not_found"), null, false, 404);
      }

      this.sendResponse(res, req.t("messages.successfully_deleted"));
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  grouped = async (req, res) => {
    try {
      const grouped = await this.settingRepository.findGrouped();
      this.sendResponse(res, req.t("messages.successfully_retrived"), grouped);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

}

module.exports = new SettingController();