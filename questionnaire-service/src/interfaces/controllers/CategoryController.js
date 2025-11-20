const Controller = require('./Controller');
const Category = require('../../domain/entities/Category');
const CategoryRepository = require('../../services/repositories/CategoryRepository');
const { exist } = require('joi');

class CategoryController extends Controller {
  constructor() {
    super();
    this.repo = new CategoryRepository();
  }

  index = async (req, res) => {
    try {
      const result = await this.repo.getAllWithPagination(req.query);
      const items = result.data.map(doc => new Category(doc));
      this.sendResponse(res, req.t("messages.successfully_retrived"), {
        items,
        pagination: result.pagination
      });
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  show = async (req, res) => {
    try {
      const item = await this.repo.findById(req.params.id);
      if (!item) {
        return this.sendResponse(res, 'Not found', [], false, 404);
      }
      this.sendResponse(res, req.t("messages.successfully_retrived"), new Category(item));
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  store = async (req, res) => {
    try {
      console.log("s");
      
      // const exists = await this.repo.findOne({ code: req.body.code });
      // console.log(exists);
      
      // if (exists) {
      //   return this.sendResponse(res, req.t("messages.already_exists"), [], false, 409);
      // }

      const created = await this.repo.create(req.body);
      this.sendResponse(res, req.t("messages.successfully_created"), new Category(created), true, 201);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await this.repo.update(id, req.body);
      this.sendResponse(res, req.t("messages.successfully_updated"), new Category(updated));
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  delete = async (req, res) => {
    try {
      const deleted = await this.repo.delete(req.params.id);
      if (!deleted) {
        return this.sendResponse(res, req.t("messages.not_found"), [], false, 404);
      }
      this.sendResponse(res, req.t("messages.successfully_deleted"));
    } catch (error) {
      this.sendError(res, error.message);
    }
  };
}

module.exports = new CategoryController();
