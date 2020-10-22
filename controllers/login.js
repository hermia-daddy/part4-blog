const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const loginRouter = require("express").Router();

loginRouter.post("/", async (request, response) => {
  const body = request.body;
  const user = await User.findOne({ username: body.username });
  console.log(user);
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);
    console.log('passwordCorrect',passwordCorrect);
    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: "invalid usernam or password",
      });
    }
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);
  response
    .status(200)
    .json({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
