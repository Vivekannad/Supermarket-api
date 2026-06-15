const { getAllUsersHandler, getUserHandler } = require("../controllers/adminController");

const router = require("express").Router();


router.get("/users", getAllUsersHandler);

router.get("/user/:id" , getUserHandler);

// router.get("/stats" , getStatsHandler);


module.exports = router;