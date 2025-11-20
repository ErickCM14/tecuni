const express = require('express');
const router = express.Router();
const CategoryController = require('../../src/interfaces/controllers/CategoryController');
const Requests = require('../../src/interfaces/requests/requests');
const CategorySchema = require('../../src/interfaces/schemas/Category');
const authMiddleware = require('../../src/interfaces/middlewares/auth');

router.get('/', CategoryController.index);
router.get('/show/:id', CategoryController.show);
// router.get('/create', CategoryController.create);
router.post('/store', Requests(CategorySchema.store()), CategoryController.store);
// router.get('/edit/:id', CategoryController.edit);
router.patch('/update/:id', Requests(CategorySchema.update()), CategoryController.update);
router.delete('/delete/:id', CategoryController.delete);

module.exports = router;