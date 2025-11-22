class CreateQuestionnaireUseCase {
    constructor({ questionnaireRepo, categoryRepo, questionTypeRepo }) {
        this.questionnaireRepo = questionnaireRepo;
        this.categoryRepo = categoryRepo;
        this.questionTypeRepo = questionTypeRepo;
    }

    async execute(payload) {
        const {
            code,
            icon,
            color,
            translations,
            categoryId,
            questions
        } = payload;

        let category;
        if (categoryId) {
            category = await this.categoryRepo.findById(categoryId);
            if (!category) throw new Error('Categoría no encontrada');
        }

        const enrichedQuestions = [];

        for (const q of questions) {
            const type = await this.questionTypeRepo.findOne({ code: q.questionType });
            if (!type) throw new Error(`Tipo de pregunta no válido: ${q.questionType}`);

            enrichedQuestions.push({
                translations: q.translations,
                questionType: {
                    code: type.code,
                    translations: type.translations
                },
                responses: (q.responses || []).map(r => ({
                    value: r.value,
                    order: r.order,
                    translations: r.translations
                }))
            });
        }

        const data = {
            code,
            icon,
            color,
            translations,
            questions: enrichedQuestions
        };

        if (categoryId && category) {
            data.categoryId = categoryId;
            data.category = {
                icon: category.icon,
                color: category.color,
                translations: category.translations
            };
        }
        return data
    }
}

module.exports = CreateQuestionnaireUseCase;
