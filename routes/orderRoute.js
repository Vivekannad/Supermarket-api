const { createUserOrderHandler, getUserOrdersHandler, getOrderByIdHandler, updateOrderStatusHandler, getAllOrdersHandler, getOrderByIdAdminHandler } = require('../controllers/ordersController');
const { restrictTo } = require('../middlewares/authHandler');

const router = require('express').Router();


// -------------USER ROUTES--------------

router.post("/" , restrictTo(["user"]) , createUserOrderHandler );

router.get("/getorders" , restrictTo(["user"]) ,  getUserOrdersHandler );

router.get("/getorder/:orderid" , restrictTo(["user"]) , getOrderByIdHandler );


// ----------------ADMIN ROUTES--------------

router.put("/admin/updateorderstatus/:orderid" , restrictTo(["admin"]) , updateOrderStatusHandler );

router.get("/admin/getorders" , restrictTo(["admin"]) ,  getAllOrdersHandler );

router.get("/admin/getorder/:orderid" , restrictTo(["admin"]) , getOrderByIdAdminHandler );



module.exports = router;