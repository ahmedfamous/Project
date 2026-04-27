const categoryRoute = require("./categoryRoute");
const productRoute = require("./productRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const reviewRoute = require("./reviewRoute");
const wishlistRoute = require("./wishlistRoute");
const addressRoute = require("./addressRoute");
const couponRoute = require("./couponRoute");
const cartRoute = require("./cartRoute");
const orderRoute = require("./orderRoute");

const mountRoutes = (app) => {
  app.use("/categories", categoryRoute);
  app.use("/products", productRoute);
  app.use("/users", userRoute);
  app.use("/auth", authRoute);
  app.use("/reviews", reviewRoute);
  app.use("/wishlist", wishlistRoute);
  app.use("/addresses", addressRoute);
  app.use("/coupons", couponRoute);
  app.use("/cart", cartRoute);
  app.use("/orders", orderRoute);
};

module.exports = mountRoutes;
