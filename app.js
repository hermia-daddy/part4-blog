const express = require("express");
const cors = require("cors");
const app = express();
const blogRouter = require("./controllers/blogs");
const config = require("./utils/config");
const mongoose = require("mongoose");

mongoose
  .connect(config.MONGODB_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected:", config.MONGODB_URI);
  })
  .catch((error) => {
    console.log("connect error:", error.message);
  });

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogRouter);

module.exports = app;
