const { createUserOrderHandler, getUserOrdersHandler, getOrderByIdHandler, updateOrderStatusHandler, getAllOrdersHandler, getOrderByIdAdminHandler, orderCancellationHandler } = require('../controllers/ordersController');
const { restrictTo } = require('../middlewares/authHandler');

const router = require('express').Router();


// -------------USER ROUTES--------------

router.post("/" , restrictTo(["user"]) , createUserOrderHandler );

router.get("/getorder/:orderid" , restrictTo(["user"]) , getOrderByIdHandler );

router.put("/cancel/:orderid" , restrictTo(["user"]) , orderCancellationHandler );


// ----------------ADMIN ROUTES--------------

router.put("/admin/updateorderstatus/:orderid" , restrictTo(["admin"]) , updateOrderStatusHandler );

router.get("/admin/getorders" , restrictTo(["admin"]) ,  getAllOrdersHandler );

router.get("/admin/getorder/:orderid" , restrictTo(["admin"]) , getOrderByIdAdminHandler );



module.exports = router;