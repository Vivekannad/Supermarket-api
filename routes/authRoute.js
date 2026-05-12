const { registerUser, loginUser , logoutHandler } = require("../controllers/authControllers");
const { validateRegister, validateLogin } = require("../middlewares/inputValidator");


const router = require("express").Router();


router.post("/register", validateRegister ,  registerUser);


router.post("/login", validateLogin , loginUser);

router.get("/logout", logoutHandler);

module.exports = router;