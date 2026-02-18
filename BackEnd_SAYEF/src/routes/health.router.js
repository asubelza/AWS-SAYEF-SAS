import { Router } from "express";
import HealthController from "../controllers/health.controller.js";

const router = Router();

// GET /health
router.get("/", (req, res) => HealthController.check(req, res));

export default router;
