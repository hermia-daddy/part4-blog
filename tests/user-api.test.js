const supertest = require("supertest");
const User = require("../models/user");
const app = require("../app");
const mongoose = require("mongoose");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
});

test("add a invalid user", async () => {
  const user = {
    username: "abcd",
    name: "zfc",
    password: "a",
  };
  await api.post("/api/users").send(user).expect(400);
});

afterAll(() => {
  mongoose.connection.close();
});
