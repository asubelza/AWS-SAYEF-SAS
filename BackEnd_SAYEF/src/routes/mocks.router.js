import { Router } from "express";
import { generateFakeUser, generateFakeProduct } from "../mocks/generators.js";
import userService from "../services/user.service.js";
import productService from "../services/product.service.js";

const router = Router();

// GET /mockingusers
router.get("/mockingusers", async (req, res) => {
  const countNum = Number(req.query.count) || 10;

  const users = [];
  for (let i = 0; i < countNum; i++) {
    users.push(generateFakeUser());
  }

  res.send({
    status: "success",
    payload: users
  });
});

// POST /generateData
router.post("/generateData", async (req, res) => {
  const users = Number(req.body.users) || 0;
  const products = Number(req.body.products) || 0;

  try {
    // Insertar usuarios usando register()
    for (let i = 0; i < users; i++) {
      const mockUser = generateFakeUser();
      await userService.register(mockUser);
    }

    // Insertar productos usando create()
    for (let i = 0; i < products; i++) {
      const mockProduct = generateFakeProduct();
      await productService.create(mockProduct);
    }

    res.send({
      status: "success",
      usersGenerated: users,
      productsGenerated: products,
      message: `Generados ${users} usuarios y ${products} productos correctamente`
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      error: "Error generando los datos mock"
    });
  }
});

export default router;
