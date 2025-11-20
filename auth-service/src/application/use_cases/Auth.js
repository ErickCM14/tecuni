const User = require('../../domain/entities/User');
const helper = require('../../utils/helper');
const passwordHelper = require('../../utils/passwordHelper');

class AuthUseCase {
    constructor({ userRepository, firebaseAuthService }) {
        this.userRepository = userRepository;
        this.firebaseAuthService = firebaseAuthService;
    }

    async auth(identity, password, typeIdentity = 'email') {
        let user;
        switch (typeIdentity) {
            case 'email':
                user = await this.userRepository.findByEmail(identity);
                break;
            case 'username':
                user = await this.userRepository.findByUsername(identity);
                break;

            default:
                user = await this.userRepository.findByEmail(identity);
                break;
        }
        if (!user) return { success: false, message: helper.lang("messages.not_found") };

        const isValid = await passwordHelper.comparePasswords(password, user.password);
        if (!isValid) return { success: false, message: "Incorrect password" };

        return { success: true, data: user };
    }

    async authSocial(socialToken, provider) {
        try {
            const decodedToken = await this.firebaseAuthService.verifySocialToken(socialToken);
            const { email, name, picture, user_id } = decodedToken;

            let user = await this.userRepository.findByEmail(email);

            if (!user) {
                const password = await passwordHelper.hashPassword(passwordHelper.randomPassword());
                const saveUser = new User({
                    name,
                    email,
                    photo: picture,
                    password: password,
                    facebookId: provider === 'facebook' ? user_id : null,
                    googleId: provider === 'google' ? user_id : null,
                    active: 1,
                });

                user = await this.userRepository.create(saveUser);
            }

            return user;
        } catch (error) {
            throw new Error(`Error logging with ${provider.toUpperCase()}: ${error.message}`);
        }
    }

    async register(body, typeIdentity = 'email') {
        try {
            const { email, username, lastname, name, phone, password, dob, country, state, photo } = body;
            let user;
            let userUsername;
            switch (typeIdentity) {
                case 'email':
                    user = await this.userRepository.findByEmail(email);
                    if (user) return { success: false, message: helper.lang("messages.already_exists") };
                    break;
                case 'username':
                    user = await this.userRepository.findByEmail(email);
                    userUsername = await this.userRepository.findByUsername(username);
                    if (user || userUsername) return { success: false, message: helper.lang("messages.already_exists") };
                    break;

                default:
                    user = await this.userRepository.findByEmail(identity);
                    break;
            }
            // let user = await this.userRepository.findByEmail(email);

            const passwordHash = await passwordHelper.hashPassword(password);
            const saveUser = new User({
                name,
                lastname,
                username,
                email,
                phone,
                password: passwordHash,
                dob,
                photo,
                country,
                state,
                active: true
            });

            user = await this.userRepository.create(saveUser);

            return { success: true, data: user };
        } catch (error) {
            throw new Error('Error register: ' + error.message);
        }
    }

    async resetPassword(id, email, password) {
        try {
            const passwordHash = await passwordHelper.hashPassword(password);
            this.userRepository.update(id, { password: passwordHash })
            return { success: true, data: [] };
        } catch (error) {
            throw new Error('Error reset password: ' + error.message);
        }
    }

    async verifyEmail(id) {
        try {
            this.userRepository.update(id, { active: true })
            return { success: true, data: [] };
        } catch (error) {
            throw new Error('Error verified email: ' + error.message);
        }
    }
}

module.exports = AuthUseCase;