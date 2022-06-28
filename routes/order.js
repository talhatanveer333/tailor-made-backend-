const Express = require("express");
const router = Express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");
const Joi = require("joi");
const stripe = require("stripe")(
  "sk_test_51LDvPeAThn3fA2tcBfGjMVDB4ZPJ9YeiujGDMYxuoEjaZH0d5Zitv3TOcqkIwzMCLFEUbXDgxgBjIl8JV6JvbUFt00vby1BhHl"
);

const { Order, validate } = require("../models/order");
const { User } = require("../models/user");
const authorization = require("../middleware/authorization");
const isCustomer = require("../middleware/isCutomer");
const isTailor = require("../middleware/isTailor");
const isAdmin = require("../middleware/isAdmin");
const { payViaStripe } = require("../middleware/payment");

router.post("/", authorization, isCustomer, async (req, res) => {
  try {
    const isValidCustomer = mongoose.Types.ObjectId.isValid(req.body.customer);
    let user = await User.findOne({ _id: req.body.customer });
    if (
      !isValidCustomer ||
      user.type !== "customer" /*if user type is not customer*/
    )
      return res.status(400).send("Invalid Customer!");
    // else if everything is good
    // picking up the relatabe data to save in database
    req.body.items.map(async (item) => {
      let order = new Order({
        trackingNo: Math.floor(Math.random() * 1000),
        customer: req.body.customer,
        tailor: item.author,
        product: item.name,
        qty: item.qty,
        description: item.description,
        amount: item.price,
      });
      //await order.save();
      const paymentIntent = await stripe.paymentIntents.create({
        amount: item.price * 100,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      //payViaStripe(req, res);
      // const session = await stripe.checkout.sessions.create({
      //   line_items: [
      //     {
      //       price: "price_1LFPSUAThn3fA2tcGjIqT3eX",
      //       quantity: 1,
      //     },
      //   ],
      //   mode: "payment",
      //   success_url: `http://localhost:3000/success.html`,
      //   cancel_url: `http://localhost:3000/cancel.html`,
      // });

      // res.redirect(303, session.url);
    });
    res.send("Your order has been sent to the tailors.");
  } catch (err) {
    console.log(err);
  }
});

router.patch("/approve/:id", authorization, isTailor, async (req, res) => {
  const orderId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(orderId))
    return res.status(400).send("Invalid order id.");

  const order = await Order.findOne({ _id: orderId /*, tailor:req.user._id*/ }); //uncomment this
  if (!order) return res.status(400).send("Order not found.");

  // else if everything is good
  order.status = "Progress";
  await order.save();
  // sending email

  // sending response
  res.send(order);
});

router.get("/myOrders", authorization, async (req, res) => {
  const orders = await Order.find({
    tailor: req.user._id,
    status: "In-Progress",
  }).populate("customer");

  return res.send(orders);
});
router.get("/allOrders", authorization, isAdmin, async (req, res) => {
  const orders = await Order.find().populate("customer").populate("tailor");

  return res.send(orders);
});
router.get("/myCompletedOrders", authorization, async (req, res) => {
  const orders = await Order.find({
    tailor: req.user._id,
    status: { $in: ["Completed", "Rejected"] },
  }).populate("customer");

  return res.send(orders);
});
router.post("/completeOrder", authorization, async (req, res) => {
  const orderId = req.body.orderId;

  const order = await Order.findOne({ _id: orderId });
  order.status = "Completed";
  await order.save();

  return res.send("Order Completed Successfully.");
});
router.post("/rejectOrder", authorization, async (req, res) => {
  const orderId = req.body.orderId;

  const order = await Order.findOne({ _id: orderId });
  order.status = "Rejected";
  await order.save();

  return res.send("Order Rejected Successfully.");
});

router.get("/query", authorization, isAdmin, async (req, res) => {
  let orders;
  const customerId = req.query.customerId;
  const tailorId = req.query.tailorId;
  const orderId = req.query.orderId;

  if (orderId) {
    orders = await Order.find({ _id: orderId });
    if (!orders) return res.status(404).send("No order(s) found.");
  } else if (customerId && tailorId) {
    orders = await Order.find().or([
      { customer: customerId },
      { tailor: tailorId },
    ]);
    if (!orders) return res.status(404).send("No order(s) found.");
  } else if (customerId) {
    orders = await Order.find({ customer: customerId });
    if (!orders) return res.status(404).send("No order(s) found.");
  } else if (tailorId) {
    orders = await Order.find({ tailor: tailorId });
    if (!orders) return res.status(404).send("No order(s) found.");
  } else {
    orders = await Order.find().limit(15);
    if (!orders) return res.status(404).send("No order(s) found.");
  }

  return res.send(orders);
});

module.exports = router;
