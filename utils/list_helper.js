const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const getSumLikes = (pre, cur) => {
    return pre + cur.likes;
  };

  return blogs.length === 0 ? 0 : blogs.reduce(getSumLikes, 0);
};

const favoriteBlog = (blogs) => {
  const sortBlog = (a, b) => {
    return a.likes - b.likes;
  };
  const length = blogs.length;
  const sortedBlog = blogs.sort(sortBlog);

  return length === 0
    ? {}
    : {
        title: sortedBlog[length - 1].title,
        author: sortedBlog[length - 1].author,
        likes: sortedBlog[length - 1].likes,
      };
};

const mostBlogs = (blogs) => {
  const authorBlogs = _.countBy(blogs, "author");
  let mostBlog = { author: "", blogs: 0 };
  _.mapKeys(authorBlogs, (value, key) => {
    if (mostBlog.blogs < value) {
      mostBlog = { author: key, blogs: value };
    }
  });
  return mostBlog;
};

const mostLike = (blogs) => {
  const authorBlogs = _.groupBy(blogs, "author");
  const authorLikes = _.mapValues(authorBlogs, (value, key) => {
    const totalLikes = value.reduce((pre, cur) => {
      return pre + cur.likes;
    }, 0);
    return totalLikes;
  });
  let mostLikeAuthor = { author: "", likes: 0 };
  _.mapKeys(authorLikes, (value, key) => {
    if (mostLikeAuthor.likes < value) {
      mostLikeAuthor = { author: key, likes: value };
    }
  });

  return mostLikeAuthor;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLike,
};
