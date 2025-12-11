import UserService from "../services/user.service.js";
import UserRepository from "../repositories/user.repository.js";

const repo = new UserRepository();

export async function createDefaultAdmin() {
  const adminEmail = "admin@sayef.com";
  const adminPassword = "admin";

  const existing = await repo.getByEmail(adminEmail);
  if (existing) {
    console.log("✔️ Admin ya existe");
    return;
  }

  console.log("⚠️ Admin no encontrado → Creando admin por defecto...");

  await UserService.register({
    email: adminEmail,
    password: adminPassword,
    role: "admin",
  });

  console.log("✔️ Usuario admin creado exitosamente");
}
