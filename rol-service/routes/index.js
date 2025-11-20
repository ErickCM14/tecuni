const express = require('express');
const router = express.Router();
const RolRouter = require('../routes/roles')
const PermissionRouter = require('../routes/permissions')
const authMiddleware = require('../src/interfaces/middlewares/auth');

// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' });
//   next()
// });

router.use('/rol', RolRouter);
router.use('/permission', PermissionRouter);

module.exports = router;