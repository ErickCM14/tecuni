const requestContext = require('../../config/requestContext');
const { i18next } = require('../../config/i18n');

class Helper {
    returnResponse = (success = true, message = "Success", status = 404) => {
        return { success, message, status };
    };

    lang = (key = '') => {
        const store = requestContext.getStore();
        const lang = store?.get('language') || 'en';

        const translation = i18next.t(key, { lng: lang });

        return translation === key
            ? i18next.t("messages.not_found", { lng: lang })
            : translation;
    };
}

module.exports = new Helper();
