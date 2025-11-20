const express = require('express');
const router = express.Router();
const RolController = require('../../src/interfaces/controllers/RolController');
const RolRequests = require('../../src/interfaces/requests/rolRequests');
const RolSchema = require('../../src/interfaces/schemas/Rol');
const authMiddleware = require('../../src/interfaces/middlewares/auth');
const { i18nMiddleware } = require('../../config/i18n');

router.use(i18nMiddleware);
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' });
//   next()
// });

router.get('/', RolController.index);
router.get('/show/:id', RolController.show);
router.get('/create', RolController.create);
router.post('/store', RolRequests(RolSchema.store()), RolController.store);
router.get('/edit/:id', RolController.edit);
router.patch('/update/:id', RolRequests(RolSchema.update()), RolController.update);
router.delete('/delete/:id', RolController.delete);

module.exports = router;