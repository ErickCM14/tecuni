const express = require('express');
const router = express.Router();
const QuestionTypeController = require('../../src/interfaces/controllers/QuestionTypeController');
const Requests = require('../../src/interfaces/requests/requests');
const QuestionTypeSchema = require('../../src/interfaces/schemas/QuestionType');
const authMiddleware = require('../../src/interfaces/middlewares/auth');

router.get('/', QuestionTypeController.index);
router.get('/show/:id', QuestionTypeController.show);
// router.get('/create', QuestionTypeController.create);
router.post('/store', Requests(QuestionTypeSchema.store()), QuestionTypeController.store);
// router.get('/edit/:id', QuestionTypeController.edit);
router.patch('/update/:id', Requests(QuestionTypeSchema.update()), QuestionTypeController.update);
router.delete('/delete/:id', QuestionTypeController.delete);

module.exports = router;