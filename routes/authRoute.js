const { registerUser, loginUser , logoutHandler, getAllUsersHandler } = require("../controllers/authControllers");
const { validate } = require("../middlewares/validateHandler");
const { loginSchema, registerSchema } = require("../validators/authValidator");


const router = require("express").Router();


router.post("/register", validate(registerSchema) ,  registerUser);


router.post("/login", validate(loginSchema) , loginUser);

router.get("/logout", logoutHandler);

router.get("/users", getAllUsersHandler);

module.exports = router;