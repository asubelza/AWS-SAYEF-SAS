// src/routes/order.router.js
import { Router } from "express";
import passport from "passport";
import OrderController from "../controllers/order.controller.js";

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crear nueva orden
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Orden creada
 */
router.post("/", (req, res, next) => OrderController.create(req, res, next));

/**
 * @swagger
 * /api/orders/me/list:
 *   get:
 *     summary: Obtener mis órdenes
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de órdenes del usuario
 */
router.get(
  "/me/list",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => OrderController.getMyOrders(req, res, next)
);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancelar orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orden cancelada
 */
router.patch(
  "/:oid/cancel",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => OrderController.cancel(req, res, next)
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obtener orden por ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orden encontrada
 */
router.get("/:oid", (req, res, next) => OrderController.getById(req, res, next));

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Listar todas las órdenes (Admin)
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de todas las órdenes
 */
router.get("/", (req, res, next) => OrderController.getAll(req, res, next));

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Eliminar orden
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orden eliminada
 */
router.delete("/:oid", (req, res, next) => OrderController.delete(req, res, next));

export default router;
