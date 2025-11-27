import { Controller } from './Controller.js';
import { getRepositories } from '../../config/RepositoryProvider.js';
import { Conversation } from '../../domain/entities/Conversation.js';

class ConversationsController extends Controller {
    constructor() {
        super();
    }

    index = async (req, res) => {
        try {
            const { conversationRepo } = await getRepositories();
            this.conversationRepository = conversationRepo;
            const result = await this.conversationRepository.getAllWithPagination(req.query);
            const items = result.data.map(doc => new Conversation(doc));
            this.sendResponse(res, "messages.successfully_retrived", {
                items,
                pagination: result.pagination
            });
        } catch (error) {
            this.sendError(res, error.message);
        }
    };

    show = async (req, res) => {
        try {
            const { conversationRepo } = await getRepositories();
            this.conversationRepository = conversationRepo;
            const item = await this.conversationRepository.findById(req.params.id);
            if (!item) {
                return this.sendResponse(res, 'Not found', [], false, 404);
            }
            this.sendResponse(res, "messages.successfully_retrived", new Conversation(item));
        } catch (error) {
            this.sendError(res, error.message);
        }
    };

    store = async (req, res) => {
        try {
            const { conversationRepo } = await getRepositories();
            this.conversationRepository = conversationRepo;
            // const exists = await this.conversationRepository.findOne({ code: req.body.code });
            // console.log(exists);

            // if (exists) {
            //   return this.sendResponse(res, "messages.already_exists", [], false, 409);
            // }

            const created = await this.conversationRepository.create(req.body);
            this.sendResponse(res, "messages.successfully_created", new Conversation(created), true, 201);
        } catch (error) {
            this.sendError(res, error.message);
        }
    };

    update = async (req, res) => {
        try {
            const { conversationRepo } = await getRepositories();
            this.conversationRepository = conversationRepo;
            const { id } = req.params;
            const updated = await this.conversationRepository.update(id, req.body);
            this.sendResponse(res, "messages.successfully_updated", new Conversation(updated));
        } catch (error) {
            this.sendError(res, error.message);
        }
    };

    delete = async (req, res) => {
        try {
            const { conversationRepo } = await getRepositories();
            this.conversationRepository = conversationRepo;
            const deleted = await this.conversationRepository.delete(req.params.id);
            if (!deleted) {
                return this.sendResponse(res, "messages.not_found", [], false, 404);
            }
            this.sendResponse(res, "messages.successfully_deleted");
        } catch (error) {
            this.sendError(res, error.message);
        }
    };
}

export default new ConversationsController();
