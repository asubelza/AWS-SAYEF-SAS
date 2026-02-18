import { Router } from "express";
import HealthController from "../controllers/health.controller.js";

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check del servidor
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 */
router.get("/", (req, res) => HealthController.check(req, res));

export default router;
