export class Conversation {
    constructor(ConversationRepo) {
        this.conversationRepo = ConversationRepo;
    }

    async execute(id, page, limit) {
        const data = await this.conversationRepo.getMessagesPaginated(id, page, limit);

        if (!data) {
            return {
                success: false,
                error: "Data not found"
            }
        }

        return data;
    }
}