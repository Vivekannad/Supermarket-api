const { createUserOrderHandler, getUserOrdersHandler, getOrderByIdHandler, updateOrderStatusHandler, getAllOrdersHandler, getOrderByIdAdminHandler, orderCancellationHandler } = require('../controllers/ordersController');
const { restrictTo } = require('../middlewares/authHandler');
const { validate } = require('../middlewares/validateHandler');
const { createOrderSchema, updateOrderStatusSchema } = require('../validators/orderValidator');

const router = require('express').Router();


// -------------USER ROUTES--------------

router.post("/" , restrictTo(["user"]) , validate(createOrderSchema) , createUserOrderHandler );

router.get("/getorder/:orderid" , restrictTo(["user"]) , getOrderByIdHandler );

router.put("/cancel/:orderid" , restrictTo(["user"]) , orderCancellationHandler );


// ----------------ADMIN ROUTES--------------

router.put("/admin/updateorderstatus/:orderid" , restrictTo(["admin"]) , validate(updateOrderStatusSchema) , updateOrderStatusHandler );

router.get("/admin/getorders" , restrictTo(["admin"]) ,  getAllOrdersHandler );

router.get("/admin/getorder/:orderid" , restrictTo(["admin"]) , getOrderByIdAdminHandler );



module.exports = router;