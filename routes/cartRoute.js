const { addToCartHandler, removeFromCartHandler, viewCartHandler } = require("../controllers/cartController");
const { restrictTo } = require("../middlewares/authHandler");

const router = require("express").Router();


router.post("/add", restrictTo(["user"]) , addToCartHandler);
router.get("/view", restrictTo(["user"]) , viewCartHandler);
router.delete("/remove/:cartItemsId", restrictTo(["user"]) , removeFromCartHandler);


module.exports = router;