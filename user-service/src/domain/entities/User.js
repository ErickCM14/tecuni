class User {
    constructor({ id, name, lastname, username, email, phone, password, dob, photo, country, state, facebookId, deviceId, googleId, appleId, active, terms, roles }) {
        this.id = id;
        this.name = name;
        this.lastname = lastname || '';
        this.username = username || '';
        this.email = email;
        this.phone = phone || null;
        this.password = password;
        this.dob = dob ? new Date(dob).toISOString().split('T')[0] : null;
        this.photo = photo || null;
        this.country = country || null;
        this.state = state || null;
        this.deviceId = deviceId || null;
        this.facebookId = facebookId || null;
        this.googleId = googleId || null;
        this.appleId = appleId || null;
        this.active = active;
        this.terms = terms;
        this.roles = roles;
    }
}

module.exports = User;
