class PatchQuestionnaireUseCase {
    constructor({ questionnaireRepo, categoryRepo, questionTypeRepo }) {
        this.questionnaireRepo = questionnaireRepo;
        this.categoryRepo = categoryRepo;
        this.questionTypeRepo = questionTypeRepo;
    }

    async execute(id, patchData) {
        const existing = await this.questionnaireRepo.findById(id);
        if (!existing) {
            throw new Error('Cuestionario no encontrado');
        }

        const updates = {};

        // ✅ Simple fields
        if (patchData.code) updates.code = patchData.code;
        if (patchData.icon) updates.icon = patchData.icon;
        if (patchData.color) updates.color = patchData.color;

        // ✅ Translations (merge)
        if (patchData.translations) {
            const existingTranslations = existing.translations instanceof Map
                ? Object.fromEntries(existing.translations)
                : JSON.parse(JSON.stringify(existing.translations));
            updates.translations = {
                ...existingTranslations,
                ...patchData.translations
            };
        }

        // ✅ Category update (optional)
        if (patchData.categoryId) {
            const category = await this.categoryRepo.findById(patchData.categoryId);
            if (!category) throw new Error('Categoría no válida');
            updates.category = {
                icon: category.icon,
                color: category.color,
                translations: category.translations
            };
        }

        if (Array.isArray(patchData.questions)) {
            const updatedQuestions = [];

            for (const q of patchData.questions) {
                const type = await this.questionTypeRepo.findOne({ code: q.questionType });
                if (!type) throw new Error(`Tipo inválido: ${q.questionType}`);

                updatedQuestions.push({
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
            updates.questions = updatedQuestions;
        }

        return updates;
    }
}

module.exports = PatchQuestionnaireUseCase;
