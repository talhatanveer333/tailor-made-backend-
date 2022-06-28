const mongoose = require("mongoose");
const Joi = require("joi");

const orderSchema = mongoose.Schema({
  trackingNo: {
    type: String,
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tailor: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: String,
  },
  qty: {
    type: Number,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    default: "In-Progress",
  },
  amount: {
    type: Number,
  },
});

const Order = mongoose.model("Order", orderSchema);

// function validateOrder(order) {
//   const schema = Joi.object({
//     trackingNo: Joi.string().required(),
//     productDetails: Joi.object({
//       name: Joi.string(),
//       stuff: Joi.string(),
//       color: Joi.string(),
//       summary: Joi.string(),
//     }).when("productType", {
//       is: "custom",
//       then: Joi.required(),
//       otherwise: Joi.optional(),
//     }),
//     customer: Joi.any().required(),
//     tailor: Joi.any().required(),
//     productType: Joi.string().required(),
//     productId: Joi.any().when("productType", {
//       is: "catalog",
//       then: Joi.required(),
//       otherwise: Joi.optional(),
//     }),
//     comments: Joi.object({
//       putDate: Joi.string(),
//     }),
//     deliveryDate: Joi.date().required(),
//     qty: Joi.number().min(1).required(),
//     totalAmount: Joi.number().min(0).required(),
//   });

//   return schema.validate(order);
// }

exports.Order = Order;
//exports.validate = validateOrder;
