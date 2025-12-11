import { Router } from "express";
import passport from "passport";
import UserDTO from "../dto/user.dto.js";

const router = Router();

// 🔒 Solo usuarios autenticados
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ status: "error", message: "No autenticado" });
    }

    const safeUser = new UserDTO(req.user);
    res.send({ status: "success", payload: safeUser });
  }
);

export default router;



