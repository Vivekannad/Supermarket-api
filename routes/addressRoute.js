const router = require("express").Router();
const {getUserAddressHandler } = require("../controllers/addressController");

router.get("/address" , getUserAddressHandler);

module.exports = router;    