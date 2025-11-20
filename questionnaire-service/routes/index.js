const express = require('express');
const router = express.Router();
const QuestionnaireRouter = require('../routes/questionnaires')
const CategoryRouter = require('../routes/categories')
const QuestionTypeRouter = require('../routes/questions_types')
const authMiddleware = require('../src/interfaces/middlewares/auth');
const { i18nMiddleware } = require('../config/i18n');
router.use(i18nMiddleware);

router.use('/questionnaire', QuestionnaireRouter);
router.use('/category', CategoryRouter);
router.use('/question-type', QuestionTypeRouter);

module.exports = router;