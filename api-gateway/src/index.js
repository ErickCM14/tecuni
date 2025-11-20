require('dotenv').config();
const express = require('express');
const dotenv = require('dotenv');
const { limiterAuth, limiterGeneral } = require('./middlewares/rateLimiter');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authProxyRouter = require('./routes/authRoutes');
const secureProxyRouter = require('./routes/proxyRoutes');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger.json');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(rateLimiter);
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: '*',
  allowedHeaders: 'Content-Type, Authorization'
}));
app.use(express.json());
// app.set('trust proxy', true);

app.use(express.urlencoded({ extended: true, limit: '10mb' }));
const proxyValue = process.env.PROXY;

if (proxyValue === 'false' || proxyValue === undefined) {
  app.set('trust proxy', false);
} else {
  app.set('trust proxy', 1);
}
// app.use(rateLimit({ windowMs: 60_000, max: 100 }));

// Logger simple
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get('/debug-ip', (req, res) => {
  res.json({
    ip: req.ip,
    xForwardedFor: req.headers['x-forwarded-for'],
    realIp: req.headers['x-real-ip'],
    remoteAddress: req.socket.remoteAddress
  });
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/:version/auth', limiterAuth, authProxyRouter);
// app.use('/api/:version', secureProxyRouter);
app.use('/api/:version', limiterGeneral, auth, secureProxyRouter);

// Manejo de errores 
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API Gateway corriendo en http://localhost:${PORT}`);
});
