// i18n.js
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['es', 'en'],
    backend: {
      loadPath: __dirname + '/../src/locales/{{lng}}.json',
    },
    interpolation: {
      escapeValue: false, // no escapamos, Express ya se encarga
    },
  });

module.exports = {
  i18next,
  i18nMiddleware: middleware.handle(i18next),
};
