const Express = require("express");
const router = Express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");

const { Feedback, validate } = require("../models/feedback");
const authorization = require("../middleware/authorization");

router.get("/mine", authorization, async (req, res) => {
  console.log("///////////////////////////");
  const feedbacks = await Feedback.find();
  if (!feedbacks) return res.send("No feedback found.");

  res.send(feedbacks);
});

router.get("/:userId", authorization, async (req, res) => {
  let userId = req.params.userId;
  if (!userId) return res.status(400).send("userId is required.");

  const isValidUser = mongoose.Types.ObjectId.isValid(userId);
  if (!isValidUser) return res.status(400).send("UserId is not valid.");

  const feedbacks = await Feedback.find({ for: userId }).populate(
    "author",
    "name rating imageUrl -_id"
  );
  if (feedbacks.length < 1) return res.send("No feedback found.");

  res.send(feedbacks);
});

router.post("/", authorization, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  req.body.author = req.user._id;
  const tailorId = req.body.tailorId;
  req.body.for = tailorId;
  let isForValid = mongoose.Types.ObjectId.isValid(tailorId);
  if (!isForValid) return res.status(400).send("Invalid user id.");

  // else everything is correct
  let feedback = new Feedback(
    _.pick(req.body, ["comment", "rating", "for", "author"])
  );
  await feedback.save();
  res.send(feedback);
  //feedback.calculateAverageRating();
});

module.exports = router;
