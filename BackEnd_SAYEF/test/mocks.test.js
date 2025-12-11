// test/mocks.test.js
import request from "supertest";
import app from "../src/app.js";

describe("Mocks Router", () => {
  test("GET /api/mocks/mockingusers?count=5 returns 5 users", async () => {
    const res = await request(app).get("/api/mocks/mockingusers?count=5");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.payload)).toBeTruthy();
    expect(res.body.payload.length).toBe(5);
    expect(res.body.payload[0]).toHaveProperty("email");
    expect(res.body.payload[0]).toHaveProperty("password");
  });

  test("POST /api/mocks/generateData inserts data", async () => {
    const res = await request(app)
      .post("/api/mocks/generateData")
      .send({ users: 2, products: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("usersGenerated", 2);
    expect(res.body).toHaveProperty("productsGenerated", 2);
  });
});
