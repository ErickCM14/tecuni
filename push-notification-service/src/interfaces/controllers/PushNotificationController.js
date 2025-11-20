const Controller = require('./Controller');
const { CreatePushNotificationUseCase, PatchPushNotificationUseCase } = require('../../application/use_cases');
const PushNotification = require('../../domain/entities/PushNotification');
const PushNotificationRepository = require('../../services/repositories/PushNotificationRepository');
const NotificationTypeRepository = require('../../services/repositories/NotificationTypeRepository');
const { FirebaseNotificationService } = require('../../services/notifications/FirebaseNotificationService');

const fcm = new FirebaseNotificationService({
  projectId: process.env.FIREBASE_PROJECT_ID
});




class PushNotificationController extends Controller {
  constructor() {
    super();
    this.repo = new PushNotificationRepository();
    this.notificationTypeRepo = new NotificationTypeRepository();
  }

  index = async (req, res) => {
    try {
      const result = await this.repo.getAllWithPagination(req.query);
      const items = result.data.map(doc => new PushNotification(doc));
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
      this.sendResponse(res, req.t("messages.successfully_retrived"), new PushNotification(item));
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
      const data = new PushNotification(result);
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
      this.sendResponse(res, req.t("messages.successfully_retrived"), new PushNotification(item));
    } catch (error) {
      this.sendError(res, error.message);
    }
  };

  showByIdUser = async (req, res) => {
    try {
      let queryCondition;
      if (req.params.idUser && req.params.status) {
        queryCondition = { 'destinatary.idUser': String(req.params.idUser).trim(), 'destinatary.statusRead': String(req.params.status).trim() };
      } else if (req.params.idUser && !req.params.status) {
        queryCondition = { 'destinatary.idUser': String(req.params.idUser).trim() };
      } else if (!req.params.idUser && req.params.status) {
        queryCondition = { 'destinatary.statusRead': String(req.params.status).trim() };
      }
      // queryCondition = { 'destinatary.idUser': String(req.params.idUser).trim(), 'destinatary.statusRead': String(req.params.status).trim() };
      const defaultSortField = 'createdAt';
      const sortOptions = req.query.sort || defaultSortField;
      const items = await this.repo.findAll(queryCondition, { sort: sortOptions });
      if (!items || items.length === 0) {
        return this.sendResponse(res, req.t("messages.not_found"), [], false, 404);
      }
      this.sendResponse(res, req.t("messages.successfully_retrived"), items.map(doc => new PushNotification(doc)));
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

      const useCase = new CreatePushNotificationUseCase({
        push_notificationRepo: this.repo,
        notificationTypeRepo: this.notificationTypeRepo
      });

      const data = await useCase.execute(req.body);
      const created = await this.repo.create(data);

      // const pushJson = await useCase.getData(data);
      // const created = await this.repo.create(req.body);
      this.sendResponse(res, req.t("messages.successfully_created"), new PushNotification(created), true, 201);
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
        useCase = new CreatePushNotificationUseCase({
          push_notificationRepo: this.repo,
          notificationTypeRepo: this.notificationTypeRepo
        });
        data = await useCase.execute(req.body);
      } else if (method === 'PATCH') {
        useCase = new PatchPushNotificationUseCase({
          push_notificationRepo: this.repo,
          notificationTypeRepo: this.notificationTypeRepo
        });
        data = await useCase.execute(id, req.body);
      }

      const updated = await this.repo.update(id, data);
      this.sendResponse(res, req.t("messages.successfully_updated"), new PushNotification(updated));
    } catch (error) {
      this.sendError(res, error.message);
    }
  };
  read = async (req, res) => {
    try {
      const item = await this.repo.findById(req.params.id);
      if (!item) {
        return this.sendResponse(res, req.t("messages.not_found"), [], false, 404);
      }
      item.destinatary.forEach(element => {
        if (element.idUser === req.params.idUser) {
          element.statusRead = 'read';
        }
      });
      const updated = await this.repo.update(req.params.id, item);
      this.sendResponse(res, req.t("messages.successfully_updated"), new PushNotification(updated));
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


  send = async (req, res) => {
    try {
      // Consulta la notificacion
      const item = await this.repo.findById(req.params.id);
      if (!item) {
        return this.sendResponse(res, req.t("messages.not_found"), [], false, 404);
      }

      let useCase = new CreatePushNotificationUseCase({
        push_notificationRepo: this.repo,
        notificationTypeRepo: this.notificationTypeRepo,
      });
      // data en formato FIREBASE
      let data = await useCase.getData(item);
      let destinataresReady = [];
      const payload = JSON.parse(JSON.stringify(data)); // clona el objeto base
      console.log(payload, "payload");

      for (const destinatary of item.destinatary) {
        if (destinatary.statusRead !== 'delivered' && destinatary.statusRead !== 'read') {
          payload.message.token = destinatary.idDevice.toString();
          console.log("payload for", payload);

          try {
            const response = await fcm.send(payload);
            console.log('Destinatary Success:', destinatary.idUser, response);
            destinatary.statusRead = 'delivered';
          } catch (err) {
            destinatary.statusRead = 'error';
            console.error('Destinatary Error:', destinatary.idUser, err.response?.data);
          }
        }

        destinataresReady.push(destinatary);
      }
      console.error('Destinatary Inicial:', item.destinatary);
      console.error('Destinatary Update:', destinataresReady);
      item.destinatary = destinataresReady;
      item.status = 'sent';
      const id = item.id;
      const saved = await this.repo.update(id, item);
      this.sendResponse(res, req.t("messages.successfully_created"), new PushNotification(saved), true, 201);
    } catch (error) {
      this.sendError(res, error.message);
    }
  };
}

module.exports = new PushNotificationController();
