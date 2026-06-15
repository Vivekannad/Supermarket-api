const router = require("express").Router();
const {getUserAddressHandler, getUserInfoHandler, updateUserInfoHandler, updateUserPasswordHandler, updateUserAddressHandler, getUserOrdersHandler } = require("../controllers/userController");
const { validate } = require("../middlewares/validateHandler");
const { updateUserInfoSchema, updateUserPasswordSchema, updateUserAddressSchema } = require("../validators/userValidator");

router.get("/address" , getUserAddressHandler);

router.get("/" , getUserInfoHandler);

router.post("/", validate(updateUserInfoSchema) , updateUserInfoHandler);

router.post("/password" , validate(updateUserPasswordSchema) , updateUserPasswordHandler);

router.post("/address" , validate(updateUserAddressSchema) , updateUserAddressHandler);

router.get("/orders" , getUserOrdersHandler);

module.exports = router;    