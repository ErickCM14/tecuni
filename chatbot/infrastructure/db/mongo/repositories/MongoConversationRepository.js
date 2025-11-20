import { ConversationRepository } from "../../../../domain/interfaces/ConversationRepository.js";
import { BaseRepository } from "./BaseRepository.js";

export class MongoConversationRepository extends ConversationRepository {
    constructor(model) {
        super();
        this.model = model;
        this.base = new BaseRepository(model);
    }

    async save(projectData) {
        const existing = await this.base.findOne({ phone: projectData.phone });
        if (existing) {
            return this.base.update(existing._id, projectData);
        }
        return this.base.create(projectData);
    }

    async getConversationByPhone(phone) {
        const conversation = await this.base.findOne({ phone });
        if (!conversation || !conversation.messages) {
            return [];
        }

        // Convertir el formato de mensajes para que sea compatible con OpenAI
        return conversation.messages.map(msg => ({
            role: msg.role,
            content: msg.message
        }));
    }

    async saveMessage(phone, role, message) {
        const now = new Date();

        const existing = await this.base.findOne({ phone });
        const newMessage = { role, message, timestamp: now };

        if (existing) {
            await this.model.updateOne(
                { phone },
                {
                    $push: { messages: newMessage },
                    $set: { updatedAt: now }
                }
            );
        } else {
            await this.base.create({
                phone,
                messages: [newMessage],
                createdAt: now,
                updatedAt: now
            });
        }
    }

    async findOne(conditions) {
        return this.base.findOne(conditions);
    }

    // async actualizarEstadoPendiente(numero, pendiente) {
    async updatePendingStatus(phone, pending) {
        // const now = new Date();
        await this.model.updateOne(
            { phone },
            {
                $set: {
                    pending: pending,
                    // ultima_actualizacion: now
                }
            }
        );
    }

    // async obtenerRegistrosPendientes() {
    async getPendingRecords() {
        return this.base.findAll({ pending: 0 });
    }

    async cleanMessages(phone) {
        await this.model.updateOne(
            { phone },
            { $set: { messages: [] } }
        );
    }

    async getAntepenultimateMessageAssistant(phone) {
        const conversation = await this.base.findOne({ phone });
        if (!conversation || !conversation.messages) {
            return null;
        }

        const assistantMessages = conversation.messages.filter(msg => msg.role === 'assistant');

        if (assistantMessages.length < 3) {
            return null;
        }

        const message = assistantMessages[assistantMessages.length - 2];

        return message.message
    }


}