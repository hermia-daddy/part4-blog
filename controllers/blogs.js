const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogRouter.post("/", async (request, response) => {
  const body = request.body;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });

  if (!blog.title || !blog.url) {
    response.status(400).end();
  } else {
    const savedBlog = await blog.save();
    response.json(savedBlog);
  }
});

blogRouter.delete("/:id", async (request, response) => {
  const deletedBlog = await Blog.findByIdAndRemove(request.params.id);
  if (deletedBlog) {
    response.status(204).json(deletedBlog);
  } else {
    response.status(400).end();
  }
});

blogRouter.put("/:id", async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
  });
  if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response.status(400).end();
  }
});

module.exports = blogRouter;
