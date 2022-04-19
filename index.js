const config = require("config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const users = require("./routes/user");
const auth = require("./routes/auth");
const products = require("./routes/product");
const orders = require("./routes/order");
const feedbacks = require("./routes/feedback");
const cors = require("./middleware/cors");
require("./startup/prod")(app);

if (!config.get("jwtPrivateKey")) {
  console.log("jwtPrivateKey is not set in environment variables!");
  process.exit(1);
}

// Middleware
mongoose
  .connect(
    "mongodb+srv://talha:admin@cluster0.5icx5.mongodb.net/smartTailorData?retryWrites=true&w=majority",
    { useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to the database...."))
  .catch((err) => console.log("Connection error!", err));
// mongoose
//   .connect("mongodb://localhost/smartTailorDatabase")
//   .then(() => console.log("Connected to the local database...."))
//   .catch((err) => console.log("Connection error!", err));

app.use(express.json());
app.use(cors);

//// Endpoints
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/products", products);
app.use("/api/orders", orders);
app.use("/api/feedbacks", feedbacks);

app.get("/", (req, res) => {
  res.send("Smart Tailor backend is running and live!");
});

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
