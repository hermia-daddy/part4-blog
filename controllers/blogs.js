const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });

  if (!blog.title || !blog.url) {
    response.status(400).end()
  }else{
    const savedBlog = await blog.save()
    response.json(savedBlog)
  }

});

module.exports = blogRouter