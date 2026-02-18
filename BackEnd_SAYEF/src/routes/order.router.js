// src/routes/order.router.js
import { Router } from "express";
import passport from "passport";
import OrderController from "../controllers/order.controller.js";

const router = Router();

// 🧾 crear orden (pública, se usa desde el checkout)
router.post("/", (req, res, next) => OrderController.create(req, res, next));

// 🙋‍♀️ Mis órdenes (requiere login JWT)
// ✅ IMPORTANTE: esta ruta va ANTES de "/:oid" y ANTES de "/"
router.get(
  "/me/list",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => OrderController.getMyOrders(req, res, next)
);

// ❌ cancelar orden (requiere login)
// (ej: PATCH /api/orders/1234567890abc/cancel)
router.patch(
  "/:oid/cancel",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => OrderController.cancel(req, res, next)
);

// 🔍 traer por id
router.get("/:oid", (req, res, next) => OrderController.getById(req, res, next));

// 📄 listar todas (para futuro panel admin)
router.get("/", (req, res, next) => OrderController.getAll(req, res, next));

// 🗑 borrar orden (si ya la usabas, la dejamos)
router.delete("/:oid", (req, res, next) => OrderController.delete(req, res, next));

export default router;
