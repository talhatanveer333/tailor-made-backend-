const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");

const addressSchema = mongoose.Schema({
  street: {
    type: String,
    maxLength: 50,
  },
  province: {
    type: String,
    maxLength: 50,
  },
  zip: {
    type: Number,
    maxLength: 10,
  },
  country: {
    type: String,
    maxLength: 50,
  },
});

// User model schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    minLength: 3,
    maxLength: 255,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minLength: 8,
    maxLength: 255,
    required: true,
  },
  name: {
    type: String,
    minLength: 3,
    maxLength: 25,
    required: true,
  },
  type: {
    type: String,
    default: "customer",
  },
  address: {
    type: addressSchema,
  },
  rating: {
    type: Number,
  },
  imageUrl: {
    type: String,
  },
  intro: {
    type: String,
    maxLength: 255,
  },
});
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      type: this.type,
      intro: this.intro,
      name: this.name,
      email: this.email,
      imageUrl: this.imageUrl,
      rating: this.rating,
    },
    config.get("jwtPrivateKey")
  );
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string()
      .regex(/.+[|@][g][o][o][g][l][e][.][c][o][m]/, `example@google.com`)
      .min(3)
      .max(255)
      .required()
      .email(),
    password: Joi.string().min(8).max(255).required(),
    name: Joi.string()
      .regex(/^[a-zA-Z ]+$/, "Only Alphabets")
      .min(3)
      .max(25)
      .required(),
    type: Joi.string(),
    address: Joi.object({
      street: Joi.string().max(50),
      province: Joi.string().max(30),
      zip: Joi.number().max(100000),
      country: Joi.string().max(50),
    }),
    rating: Joi.number().max(5),
    imageUrl: Joi.any(),
    intro: Joi.string().max(255),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
