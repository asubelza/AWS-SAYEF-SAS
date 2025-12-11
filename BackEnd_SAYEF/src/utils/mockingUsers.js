// src/utils/mockingUsers.js
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

export async function generateMockUser() {
  const passwordHash = bcrypt.hashSync("coder123", 10); // password encriptada

  return {
    _id: faker.database.mongodbObjectId(),           // id estilo mongo
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: passwordHash,
    role: faker.helpers.arrayElement(["user", "admin"]),
    pets: [],
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString()
  };
}
