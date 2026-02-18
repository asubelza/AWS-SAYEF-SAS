import express from 'express';
import dotenv from 'dotenv';
import passport from './middlewares/jwtStrategy.js';
import cors from 'cors';
import rateLimit from 'express-rate-limit';


import mocksRouter from './routes/mocks.router.js';
import productRouter from './routes/product.router.js';
import cartRouter from './routes/cart.router.js';
import userRouter from './routes/users.router.js';
import viewsRouter from './routes/views.router.js';
import orderRouter from "./routes/order.router.js";
import healthRouter from "./routes/health.router.js";


import { __dirname } from './utils/constantUtil.js';
import { swaggerUi, specs } from "./config/swagger.config.js";

import { logger } from "./config/logger.js";
import { createDefaultAdmin } from "./config/createDefaultAdmin.js";
import env from "./config/env.config.js";



// ========================================================
// ** Inicializar un user administrador admin-admin **
// ========================================================
async function init() {
  await createDefaultAdmin();  // 👈 Se ejecuta al inicio
}

init();

dotenv.config();

const app = express();

// ========================================================
// 🟦 CORS para permitir requests desde el FRONT (5173)
// ========================================================
app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
}));

// ========================================================
// 🟦 Rate Limiting
// ========================================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { status: 'error', message: 'Demasiadas solicitudes, intenta más tarde' }
});
app.use('/api/', limiter);

// ========================================================
// 🟦 HTTP LOGGER (Winston)
// ========================================================
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

// ========================================================
// 🟦 Middlewares básicos
// ========================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Passport
app.use(passport.initialize());

// ========================================================
// 🟦 Endpoint base
// ========================================================
app.get('/', (req, res) => {
  logger.info("Endpoint raíz accedido");
  res.send('Servidor funcionando ✔️');
});

// Ruta protegida
app.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    logger.info(`Usuario accedió a /protected: ${req.user?.email}`);
    res.send(`Ruta protegida. Usuario: ${req.user?.email || 'desconocido'}`);
  }
);

// ========================================================
// 🟦 Swagger
// ========================================================
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));


// ========================================================
// 🟦 Routers
// ========================================================
app.use("/api/mocks", mocksRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/", viewsRouter);

// 👇 health check
app.use("/health", healthRouter);

export default app;
