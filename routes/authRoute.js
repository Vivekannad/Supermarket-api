const { registerUser, loginUser , logoutHandler, getAllUsersHandler } = require("../controllers/authControllers");
const { validateRegister, validateLogin } = require("../middlewares/inputValidator");


const router = require("express").Router();


router.post("/register", validateRegister ,  registerUser);


router.post("/login", validateLogin , loginUser);

router.get("/logout", logoutHandler);

router.get("/users", getAllUsersHandler);

module.exports = router;