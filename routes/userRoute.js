const router = require("express").Router();
const {getUserAddressHandler, getUserInfoHandler, updateUserInfoHandler, updatePasswordHandler, updateAddressHandler, getUserOrdersHandler } = require("../controllers/userController");

router.get("/address" , getUserAddressHandler);

router.get("/" , getUserInfoHandler);

router.post("/", updateUserInfoHandler);

router.post("/password" , updatePasswordHandler);

router.post("/address" , updateAddressHandler);

router.get("/orders" , getUserOrdersHandler);

module.exports = router;    