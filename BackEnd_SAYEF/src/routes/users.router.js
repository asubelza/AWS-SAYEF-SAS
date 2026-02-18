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

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "123456"
 *               first_name:
 *                 type: string
 *                 example: "Juan"
 *               last_name:
 *                 type: string
 *                 example: "Perez"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/register",
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Password debe tener al menos 6 caracteres'),
  body('first_name').optional().isString().trim(),
  body('last_name').optional().isString().trim(),
  validate,
  (req, res, next) => UserController.register(req, res, next)
);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login",
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Password requerido'),
  validate,
  (req, res, next) => UserController.login(req, res, next)
);

/**
 * @swagger
 * /api/users/google:
 *   post:
 *     summary: Iniciar sesión con Google
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Token de Google OAuth
 *     responses:
 *       200:
 *         description: Login con Google exitoso
 */
router.post("/google", (req, res, next) =>
  UserController.googleLogin(req, res, next)
);

/**
 * @swagger
 * /api/users/current:
 *   get:
 *     summary: Obtener usuario actual
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario actual
 *       401:
 *         description: No autorizado
 */
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => UserController.getCurrent(req, res, next)
);

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     summary: Actualizar perfil de usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       401:
 *         description: No autorizado
 */
router.patch(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => UserController.updateMe(req, res, next)
);

export default router;
