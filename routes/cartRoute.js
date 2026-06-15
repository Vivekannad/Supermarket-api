const { addToCartHandler, removeFromCartHandler, viewCartHandler } = require("../controllers/cartController");
const { restrictTo } = require("../middlewares/authHandler");
const { validate } = require("../middlewares/validateHandler");
const { addToCartSchema } = require("../validators/cartValidator");

const router = require("express").Router();


router.post("/add", restrictTo(["user"]) , validate(addToCartSchema) , addToCartHandler);
router.get("/view", restrictTo(["user"]) , viewCartHandler);
router.delete("/remove/:cartItemsId", restrictTo(["user"]) , removeFromCartHandler);


module.exports = router;