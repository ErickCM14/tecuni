const express = require('express');
const router = express.Router();
const QuestionnaireController = require('../../src/interfaces/controllers/QuestionnaireController');
const Requests = require('../../src/interfaces/requests/requests');
const QuestionnaireSchema = require('../../src/interfaces/schemas/Questionnaire');
const authMiddleware = require('../../src/interfaces/middlewares/auth');

router.get('/', QuestionnaireController.index);
router.get('/show/:id', QuestionnaireController.show);
router.get('/show-code/:code', QuestionnaireController.showByCode);
// router.get('/create', QuestionnaireController.create);
// router.post('/store', Requests(QuestionnaireSchema.store()), QuestionnaireController.store);
router.post('/store', Requests(QuestionnaireSchema.store()), QuestionnaireController.store);
// router.get('/edit/:id', QuestionnaireController.edit);
// router.patch('/update/:id', Requests(QuestionnaireSchema.update()), QuestionnaireController.update);
router.put('/update/:id', Requests(QuestionnaireSchema.update()), QuestionnaireController.update);
router.patch('/update/:id', Requests(QuestionnaireSchema.patch()),QuestionnaireController.update);
router.delete('/delete/:id', QuestionnaireController.delete);

module.exports = router;