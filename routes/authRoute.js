const { registerUser, loginUser , logoutHandler } = require("../controllers/authControllers");
const { validate } = require("../middlewares/validateHandler");
const { loginSchema, registerSchema } = require("../validators/authValidator");


const router = require("express").Router();


router.post("/register", validate(registerSchema) ,  registerUser);


router.post("/login", validate(loginSchema) , loginUser);

router.get("/logout", logoutHandler);


module.exports = router;