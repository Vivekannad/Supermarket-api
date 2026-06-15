const router = require("express").Router();
const productsRoute = require("./productsRoute");
const authRoute = require("./authRoute");
const cartRoute = require("./cartRoute");
const orderRoute = require("./orderRoute");
const userRoute = require("./userRoute");
const adminRoute = require("./adminRoute");
const { authHandler , restrictTo } = require("../middlewares/authHandler");


// auth route
router.use("/auth", authRoute);

// protected routes
router.use("/products", authHandler , productsRoute );
router.use("/cart", authHandler , cartRoute );
router.use("/orders", authHandler , orderRoute );
router.use("/me", authHandler , restrictTo(["user"]) , userRoute );
router.use("/admin", authHandler , restrictTo(["admin"]) , adminRoute );

module.exports = router;