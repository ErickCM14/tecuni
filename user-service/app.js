require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const requestContext = require('./config/requestContext');
const { i18nMiddleware } = require('./config/i18n');

var indexRouter = require('./routes/index');

var app = express();
app.use(cors({
  origin: '*',
  methods: '*',
  allowedHeaders: 'Content-Type, Authorization'
}));
app.use(i18nMiddleware);
app.use((req, res, next) => {
  requestContext.run(new Map(), () => {
    const store = requestContext.getStore();
    store.set('language', req.language);
    next();
  });
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users/', indexRouter);

module.exports = app;
