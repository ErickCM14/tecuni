class Category {
    constructor({ _id, icon, color, translations }) {
        this.id = _id;
        this.icon = icon;
        this.color = color;
        this.translations = translations;
    }
}

module.exports = Category;