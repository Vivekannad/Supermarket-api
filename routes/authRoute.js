const {  logoutHandler, registerUserHandler, loginUserHandler } = require("../controllers/authControllers");
const { validate } = require("../middlewares/validateHandler");
const { loginSchema, registerSchema } = require("../validators/authValidator");


const router = require("express").Router();


router.post("/register", validate(registerSchema) ,  registerUserHandler);


router.post("/login", validate(loginSchema) , loginUserHandler);

router.get("/logout", logoutHandler);


module.exports = router;