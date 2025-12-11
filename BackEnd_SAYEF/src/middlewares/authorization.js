// src/middlewares/authorization.js
import { ROLES } from "../utils/enums.js";

/**
 * Middleware para autorizar rutas según rol del usuario
 * @param  {...string} allowedRoles - Roles permitidos para la ruta
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: "error", message: "No autorizado" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ status: "error", message: "Acceso denegado: rol insuficiente" });
    }

    next();
  };
};
