import dotenv from "dotenv";
dotenv.config();

const requiredVars = ['MONGO_URL', 'JWT_SECRET'];

const missing = requiredVars.filter(v => !process.env[v]);
if (missing.length > 0) {
  console.error(`❌ Variables de entorno faltantes: ${missing.join(', ')}`);
  process.exit(1);
}

export default {
  port: process.env.PORT || 8080,
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  env: process.env.NODE_ENV
};
