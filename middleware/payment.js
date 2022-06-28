const publishAbleKey =
  "pk_test_51LDvPeAThn3fA2tcWhGVAaWjjRK67Pecj60QOcDHmZO9fFGwHWFm56uhUAXj3Qb7FP2qv8iWTmdDn3YZpO3f3ncR00VZbYx6yG";
const secretKey =
  "sk_test_51LDvPeAThn3fA2tcBfGjMVDB4ZPJ9YeiujGDMYxuoEjaZH0d5Zitv3TOcqkIwzMCLFEUbXDgxgBjIl8JV6JvbUFt00vby1BhHl";

const stripe = require("stripe")(secretKey);

exports.payViaStripe = (req, res) => {
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: "Talha Tanveer",
      address: {
        linel: "123 FAST NUCES Hostels",
        postalCode: "1122",
        city: "Faislabad",
        state: "Punjab",
        country: "Pakistan",
      },
    })
    .then((customer) => {
      return stripe.charges.create({
        amount: 7000,
        description: "Smart Tailor Customer Payment",
        currency: "PKR",
        customer: customer._id,
      });
    })
    .then((charge) => {
      res.send("Success");
    })
    .catch((err) => {
      res.send(err);
    });
};
