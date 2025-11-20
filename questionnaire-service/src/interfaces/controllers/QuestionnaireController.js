const Controller = require('./Controller');
const { CreateQuestionnaireUseCase, PatchQuestionnaireUseCase } = require('../../application/use_cases');
const Questionnaire = require('../../domain/entities/Questionnaire');
const QuestionnaireRepository = require('../../services/repositories/QuestionnaireRepository');
const CategoryRepository = require('../../services/repositories/CategoryRepository');
const QuestionTypeRepository = require('../../services/repositories/QuestionTypeRepository');

class QuestionnaireController extends Controller {
  constructor() {
    super();
    this.repo = new QuestionnaireRepository();
    this.categoryRepo = new CategoryRepository();
    this.questionTypeRepo = new QuestionTypeRepository();
  }

  index = async (req, res) => {
    try {
      const result = await this.repo.getAllWithPagination(req.query);
      const items = result.data.map(doc => new Questionnaire(doc));
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
        return this.sendResponse(res, req.t("messages.not_found"), [], false, 404);
      }
      this.sendResponse(res, req.t("messages.successfully_retrived"), new Questionnaire(item));
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  // Show by Code
  showByCode = async (req, res) => {
    try {
      const { code } = req.params;
      const result = await this.repo.findOne({ code });

      if (!result) {
        return this.sendResponse(res, req.t("messages.not_found"), null, false, 404);
      }
      const data = new Questionnaire(result);
      this.sendResponse(res, req.t("messages.successfully_retrived"), data);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  show = async (req, res) => {
    try {
      const item = await this.repo.findById(req.params.id);
      if (!item) {
        return this.sendResponse(res, req.t("messages.not_found"), [], false, 404);
      }
      this.sendResponse(res, req.t("messages.successfully_retrived"), new Questionnaire(item));
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  store = async (req, res) => {
    try {
      const exists = await this.repo.findOne({ code: req.body.code });
      if (exists) {
        return this.sendResponse(res, req.t("messages.already_exists"), [], false, 409);
      }

      const useCase = new CreateQuestionnaireUseCase({
        questionnaireRepo: this.repo,
        categoryRepo: this.categoryRepo,
        questionTypeRepo: this.questionTypeRepo
      });

      const data = await useCase.execute(req.body);
      const created = await this.repo.create(data);
      // const created = await this.repo.create(req.body);
      this.sendResponse(res, req.t("messages.successfully_created"), new Questionnaire(created), true, 201);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const exists = await this.repo.findById(id);
      if (!exists) {
        return this.sendResponse(res, req.t("messages.not_found"), [], false, 404);
      }
      const method = req.method;
      console.log(method);

      let useCase;
      let data;
      if (method === 'PUT') {
        useCase = new CreateQuestionnaireUseCase({
          questionnaireRepo: this.repo,
          categoryRepo: this.categoryRepo,
          questionTypeRepo: this.questionTypeRepo
        });
        data = await useCase.execute(req.body);
      } else if (method === 'PATCH') {
        useCase = new PatchQuestionnaireUseCase({
          questionnaireRepo: this.repo,
          categoryRepo: this.categoryRepo,
          questionTypeRepo: this.questionTypeRepo
        });
        data = await useCase.execute(id, req.body);
      }

      const updated = await this.repo.update(id, data);
      this.sendResponse(res, req.t("messages.successfully_updated"), new Questionnaire(updated));
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

module.exports = new QuestionnaireController();
