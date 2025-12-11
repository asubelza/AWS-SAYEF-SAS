import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT || 8080,
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  env: process.env.NODE_ENV
};
