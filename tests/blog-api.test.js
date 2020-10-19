const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("blog are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("blog unique flag is id", async () => {
  const blogs = await helper.blogsInDb();
  blogs.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
});

test("add a validata blog", async () => {
  const blog = {
    title: "this is a test blog",
    url: "http://www.baidu.com",
    author: "zhong fc",
    likes: 100,
  };

  await api.post("/api/blogs").send(blog);

  const blogs = await helper.blogsInDb();
  expect(blogs).toHaveLength(helper.initialBlogs.length + 1);
  const titles = blogs.map((blog) => blog.title);
  expect(titles).toContain("this is a test blog");
});

test("miss likes will be zero", async () => {
  const blog = {
    title: "this is a zero like blog",
    url: "http://www.baidu.com",
    author: "zhong fc",
  };

  const response = await api.post("/api/blogs").send(blog);
  expect(response.body.likes).toBe(0);
});

test("miss title and url", async () => {
  const blog = {
    title: "this is a test blog",
    author: "zhong fc",
    likes: 100,
  };
  await api.post("/api/blogs").send(blog).expect(400);
});

test("delete a nonExisted blog", async () => {
  const nonExistingId = await helper.nonExistingId();
  await api.delete(`/api/blogs/${nonExistingId}`).expect(400);
});

test("delete a existed blog", async () => {
  const blogs = await helper.blogsInDb();
  const deleteId = blogs[0].id;
  await api.delete(`/api/blogs/${deleteId}`).expect(204);
});

test("update a nonExisted blog", async () => {
  const nonExistingId = await helper.nonExistingId();
  const blog = { title: "nonExisting", url: "nonExisting" };
  await api.put(`/api/blogs/${nonExistingId}`).send(blog).expect(400);
});

test("update a existed blog", async () => {
  const blogs = await helper.blogsInDb();
  let updateBlog = blogs[0];
  const updateId = updateBlog.id;
  updateBlog={
    title: "update title",
  }

  const response = await api.put(`/api/blogs/${updateId}`).send(updateBlog);
  expect(response.body.title).toEqual("update title");
});

afterAll(() => {
  mongoose.connection.close();
});
