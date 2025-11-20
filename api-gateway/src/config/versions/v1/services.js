const dotenv = require('dotenv');
module.exports = {
  auth: process.env.AUTH_SERVICE_URL,
  users: process.env.USER_SERVICE_URL,
  rol: process.env.ROL_SERVICE_URL,
  permission: process.env.PERMISSION_SERVICE_URL,
  settings: process.env.SETTING_SERVICE_URL,
  questionnaire: process.env.QUESTIONNAIRE_SERVICE_URL,
  category: process.env.CATEGORY_SERVICE_URL,
  "question-type": process.env.QUESTION_TYPE_SERVICE_URL,
  "push-notification": process.env.PUSH_NOTIFICATION_SERVICE_URL,
  "notification-type": process.env.NOTIFICATION_TYPE_SERVICE_URL,
  chatbot: process.env.CHATBOT_SERVICE_URL,
};