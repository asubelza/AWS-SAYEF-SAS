import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

export function generateFakeUser() {
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync("coder123", 10),
    role: faker.helpers.arrayElement(["user", "admin"]),
  };
}

export function generateFakeProduct() {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: Number(faker.commerce.price()),
    stock: faker.number.int({ min: 1, max: 200 }),
    category: faker.commerce.department(),
    code: faker.string.alphanumeric(8),
    status: true,
    thumbnails: [faker.image.urlPlaceholder({ width: 300, height: 300 })],
  };
}
