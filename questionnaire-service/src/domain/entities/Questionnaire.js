class Questionnaire {
    constructor({ _id, code, icon, color, translations, category, questions }) {
        this.id = _id;
        this.code = code;
        this.icon = icon;
        this.color = color;
        this.translations = translations;
        this.category = category;
        this.questions = questions;
    }
}

module.exports = Questionnaire;
