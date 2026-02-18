// src/controllers/user.controller.js
import UserService from "../services/user.service.js";
import { generateToken } from "../utils/generateToken.js";
import UserDTO from "../dto/user.dto.js";
import { verifyGoogleToken } from "../services/google.service.js";
import crypto from "node:crypto";

class UserController {
  async register(req, res, next) {
    try {
      const user = await UserService.register(req.body);
      const token = generateToken(user);
      const safeUser = new UserDTO(user);

      res.status(201).json({ status: "success", payload: safeUser, token });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await UserService.login(email, password);

      const token = generateToken(user);
      const safeUser = new UserDTO(user);

      return res.json({ status: "success", payload: safeUser, token });
    } catch (error) {
      console.error("Error en login:", error);

      if (error.message === "Usuario no encontrado") {
        return res.status(404).json({
          status: "error",
          message: error.message,
        });
      }

      if (error.message === "Contraseña incorrecta") {
        return res.status(401).json({
          status: "error",
          message: error.message,
        });
      }

      // Cualquier otra cosa sí es un 500 real
      return next(error);
    }
  }

  async googleLogin(req, res, next) {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        return res.status(400).json({
          status: "error",
          message: "Falta idToken de Google",
        });
      }

      // 1) Verificar token con Google
      const { email, name } = await verifyGoogleToken(idToken);

      // 2) Buscar usuario por email
      let user = await UserService.repository.getByEmail(email);

      // 3) Si no existe, lo creo usando el service (así se hashea una contraseña random)
      if (!user) {
        const randomPassword = crypto.randomUUID?.() || Date.now().toString();

        // Podés intentar separar nombre y apellido a partir de "name"
        let first_name = "";
        let last_name = "";

        if (name) {
          const parts = name.split(" ");
          first_name = parts[0] || "";
          last_name = parts.slice(1).join(" ") || "";
        }

        user = await UserService.register({
          email,
          password: randomPassword,
          role: "user",
          first_name,
          last_name,
        });
      }

      // 4) Generar JWT y armar DTO
      const token = generateToken(user);
      const safeUser = new UserDTO(user);

      return res.json({
        status: "success",
        payload: safeUser,
        token,
      });
    } catch (error) {
      console.error("Error en googleLogin:", error);
      next(error);
    }
  }

  async getCurrent(req, res, next) {
    try {
      const safeUser = new UserDTO(req.user);
      res.json({ status: "success", payload: safeUser });
    } catch (error) {
      next(error);
    }
  }

  // 🆕 Actualizar datos del usuario logueado (perfil)
 async updateMe(req, res, next) {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ status: "error", message: "No autenticado" });
    }

    const { first_name, last_name } = req.body;

    const updated = await UserService.update(userId, { first_name, last_name });

    // si tu update devuelve "writeResult", volvemos a buscar el usuario
    const fresh = await UserService.repository.getById(userId);
    const safeUser = new UserDTO(fresh);

    return res.json({ status: "success", payload: safeUser });
  } catch (error) {
    next(error);
  }
}
}

export default new UserController();
