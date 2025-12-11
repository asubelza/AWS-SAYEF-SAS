// src/routes/users.router.js
import { Router } from "express";
import passport from "passport";
import UserController from "../controllers/user.controller.js";  // 👈 IMPORT

const router = Router();

// Registro
router.post("/register", (req, res, next) =>
  UserController.register(req, res, next)
);

// Login
router.post("/login", (req, res, next) =>
  UserController.login(req, res, next)
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
