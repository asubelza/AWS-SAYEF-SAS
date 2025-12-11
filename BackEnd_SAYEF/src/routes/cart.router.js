import { Router } from "express";
import passport from "passport";
import { authorizeRoles } from "../middlewares/authorization.js";
import CartController from "../controllers/cart.controller.js";

const router = Router();

// Agregar producto: solo usuarios
router.post(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("user"),
  CartController.addProduct
);

// Finalizar compra
router.post(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("user"),
  CartController.purchase
);

export default router;









