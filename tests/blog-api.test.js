const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
});

test("add a blog with token", async () => {
  const testUser = {
    username: "test",
    password: "test",
  };
  await api.post("/api/users").send(testUser);
  const tokenResponse = await api.post('/api/login').send(testUser)
  const token = tokenResponse.body.token;
  await api
    .post("/api/blogs")
    .set("Authorization",`Bearer ${token}`)
    .send({
      title: "test add blog with token",
      url: "www.baidu.com",
      author: "zfc",
      likes: 50,
    })
    .expect(200);
});

test("add a blog with non token", async () => {
  await api
    .post("/api/blogs")
    .send({
      title: "test add blog with non token",
      url: "www.baidu.com",
      author: "zfc",
      likes: 50,
    })
    .expect(401);
});

afterAll(() => {
  mongoose.connection.close();
});
