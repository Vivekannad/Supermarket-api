const { getAllUsersHandler, getUserHandler, getAdminStatsHandler } = require("../controllers/adminController");

const router = require("express").Router();


router.get("/users", getAllUsersHandler);

router.get("/user/:id" , getUserHandler);

router.get("/stats" , getAdminStatsHandler);


module.exports = router;