// src/routes/users.router.js
import { Router } from "express";
import passport from "passport";
import { body, validationResult } from "express-validator";
import UserController from "../controllers/user.controller.js";

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', errors: errors.array() });
  }
  next();
};

// Registro
router.post("/register",
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Password debe tener al menos 6 caracteres'),
  body('first_name').optional().isString().trim(),
  body('last_name').optional().isString().trim(),
  validate,
  (req, res, next) => UserController.register(req, res, next)
);

// Login
router.post("/login",
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Password requerido'),
  validate,
  (req, res, next) => UserController.login(req, res, next)
);

// 👇 Google login
router.post("/google", (req, res, next) =>
  UserController.googleLogin(req, res, next)
);

// Obtener usuario actual (JWT + DTO)
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => UserController.getCurrent(req, res, next)
);

// 🆕 Actualizar datos del usuario logueado (perfil)
// PATCH /api/users/me
router.patch(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => UserController.updateMe(req, res, next)
);

export default router;
