// test/validation.test.js
import request from "supertest";
import app from "../src/app.js";

describe("Validation Tests", () => {
  describe("POST /api/users/register", () => {
    test("debe fallar con email inválido", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({ email: "no-es-email", password: "123456" });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    test("debe fallar con password muy corto", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({ email: "test@test.com", password: "123" });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    test("debe fallar sin email ni password", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({});
      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/users/login", () => {
    test("debe fallar con email inválido", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({ email: "no-es-email", password: "123456" });
      expect(res.statusCode).toBe(400);
    });

    test("debe fallar sin datos", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({});
      expect(res.statusCode).toBe(400);
    });
  });
});

describe("Health Check", () => {
  test("GET /health debe responder 200", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
  });
});
