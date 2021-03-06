const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const { validate, User } = require("../models/user");
const authorization = require("../middleware/authorization");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();

router.get("/", authorization, async (req, res) => {
  const users = await User.find({ type: { $ne: "admin" } });
  if (!users) return res.status(400).send("No user found.");

  return res.send(
    _.map(
      users,
      _.partialRight(_.pick, [
        "email",
        "password",
        "firstName",
        "lastName",
        "type",
        "imageUrl",
      ])
    )
  );
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message); // if any error in data recieved

  let user = await User.findOne({ email: req.body.email }); // if user already exist
  if (user) return res.status(400).send("User already exist!");

  // else if everything is good
  user = new User(
    _.pick(req.body, [
      "email",
      "password",
      "name",
      "rating",
      "type",
      "address",
      "imageUrl",
    ])
  );
  const salt = await bcrypt.genSalt(10); // generating salt
  user.password = await bcrypt.hash(user.password, salt); // generating hashed password using bcrypt
  await user.save();

  const token = user.generateAuthToken();
  res.send(token);
});

router.post("/tailor", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message); // if any error in data recieved

  let user = await User.findOne({ email: req.body.email }); // if user already exist
  if (user) return res.status(400).send("User already exist!");

  // else if everything is good
  user = new User(
    _.pick(req.body, [
      "email",
      "password",
      "name",
      "rating",
      "type",
      "address",
      "imageUrl",
    ])
  );
  const salt = await bcrypt.genSalt(10); // generating salt
  user.password = await bcrypt.hash(user.password, salt); // generating hashed password using bcrypt
  user.type = "tailor";
  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token);
  res.send(
    _.pick(user, ["_id", "email", "name", "address", "rating", "imageUrl"])
  );
});

router.get("/me", authorization, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) return res.status(400).send("Invalid email or password");

  if (user.type !== "admin")
    return res.send(_.pick(user, ["email", "name", "imageUrl"]));
  return res.send(_.pick(user, ["email", "name", "type", "imageUrl"]));
});
router.get("/tailors", authorization, async (req, res) => {
  const users = await User.find()
    .limit(10)
    .sort({ rating: -1 })
    .select({ password: 0, __v: 0 });
  if (users.length < 0) return res.status(400).send("No tailors found.");

  if (req.user.type !== "admin")
    return res.send(
      users.map((user) =>
        _.pick(user, ["_id", "name", "rating", "address", "imageUrl"])
      )
    );
  return res.send(
    users.map((user) =>
      _.pick(user, ["_id", "name", "rating", "address", "type", "imageUrl"])
    )
  );
});

router.patch("/me/edit", authorization, async (req, res) => {
  let user = await User.findOne({ _id: req.user._id });
  if (!user) return res.status(400).send("Invalid email or password");

  const address = req.body.address;
  if (address) user.address.push(address);

  await user.save();
  res.send(user);
});

module.exports = router;
