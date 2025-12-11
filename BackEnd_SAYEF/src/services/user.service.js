// src/services/user.service.js
import bcrypt from "bcrypt";
import UserRepository from "../repositories/user.repository.js";

class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  async register(userData) {
    const existingUser = await this.repository.getByEmail(userData.email);
    if (existingUser) {
      throw new Error("El usuario ya existe con ese email");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return this.repository.create({
      ...userData,
      password: hashedPassword,
    });
  }

  async login(email, password) {
    const user = await this.repository.getByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Contraseña incorrecta");

    return user;
  }

  async getCurrent(user) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  // 🆕 actualizar datos básicos (perfil)
  async update(id, data) {
    // Nunca permitir actualizar password por acá
    if ("password" in data) {
      delete data.password;
    }
    return this.repository.update(id, data);
  }
}

export default new UserService();
