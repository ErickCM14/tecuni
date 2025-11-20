class Permission {
    constructor({ _id, id, tag, name, description }) {
        this.id = (id || _id)?.toHexString?.() || String(id || _id);
        this.tag = tag;
        this.name = name;
        this.description = description || "";
    }
}

module.exports = Permission;
