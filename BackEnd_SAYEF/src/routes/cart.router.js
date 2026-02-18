import { Router } from "express";
import passport from "passport";
import { authorizeRoles } from "../middlewares/authorization.js";
import CartController from "../controllers/cart.controller.js";

const router = Router();

/**
 * @swagger
 * /api/carts/{cartId}/product/{productId}:
 *   post:
 *     summary: Agregar producto al carrito
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto agregado al carrito
 *       403:
 *         description: Acceso denegado
 */
router.post(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("user"),
  CartController.addProduct
);

/**
 * @swagger
 * /api/carts/{cartId}/purchase:
 *   post:
 *     summary: Finalizar compra
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compra finalizada
 *       403:
 *         description: Acceso denegado
 */
router.post(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("user"),
  CartController.purchase
);

export default router;









