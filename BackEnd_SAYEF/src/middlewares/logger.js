import winston from "winston";
import path from "path";
import __dirname from "../utils/constantsUtil.js";

const { combine, timestamp, printf, colorize } = winston.format;

// Formato personalizado de logs
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Crear logger
const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    // Log en archivos
    new winston.transports.File({ filename: path.join(__dirname, "logs/errors.log"), level: "error" }),
    new winston.transports.File({ filename: path.join(__dirname, "logs/all.log") }),
  ],
});

// Si estamos en desarrollo, también loguear en consola
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    })
  );
}

export default logger;

