const Permission = require('./Permission');

class Rol {
    constructor({ _id, id, name, description, is_default, permissions = [] }) {
        this.id = id || _id;
        this.name = name;
        this.description = description || "";
        this.is_default = is_default || 0;
        this.permissions = permissions.map(p => new Permission(p));
    }
}

module.exports = Rol;
