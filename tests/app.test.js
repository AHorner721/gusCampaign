// library for making fake HTTP requests
const request = require("supertest");

const app = require("../app");

test("GET index", async () => {
  const response = await request(app).get(`/`);
  expect(response.status).toBe(200);
});
