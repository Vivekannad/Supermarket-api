
// ------------------User Order Handlers ----------------

const { getOrderByIdAdminService, getAllOrdersService, getOrderByIdService,  createUserOrderService, updateOrderStatusService, cancelOrderService } = require("../models/orderModel");

const createUserOrderHandler = async(req,res , next) => {
    const cartItemsIds = req.body.cartItemIds;
    const user_id = parseInt(req.user.id);
    // address data:- {
    //     city: "city",
    //     state: "state",
    //     country: "country",
    //     zip: "zip"
    //}
    const addressData = req.body.address; // optional address data
    try  {
        const order = await createUserOrderService(user_id, cartItemsIds, addressData);

        res.status(201).json({message : "Order created successfully" , order});

    }catch(err){
        next(err);
    }
}



const getOrderByIdHandler = async(req,res,next) => {
    try {
        const userId = parseInt(req.user.id);
        const orderId = parseInt(req.params.orderid);
        const order = await getOrderByIdService(orderId , userId);
        if(!order) {
          return  res.status(404).json({message : "Order not found"});
        };
        res.status(200).json({message : "Order fetched successfully" , order});

    }catch(err){
        next(err);
    }
}

const orderCancellationHandler = async(req,res,next) => {
    try {

        const orderId = parseInt(req.params.orderid);
        const userId = parseInt(req.user.id);
        const order = await cancelOrderService(orderId , userId);
        if(!order) {
           return res.status(404).json({message : "Order not found"});
        };
        res.status(200).json({message : "Order cancelled successfully" , order});

    }catch(err){
        next(err);
    }
}


// ------------------Admin Order Handlers ----------------

const getAllOrdersHandler = async(req,res,next) => {
    try{

        const orders = await getAllOrdersService();
        res.status(200).json({message : "Orders fetched successfully" , orders});
    }catch(err){
        next(err);
    }
}

const getOrderByIdAdminHandler = async(req,res,next) => {
    try{
        const orderId = parseInt(req.params.orderid);
        const order = await getOrderByIdAdminService(orderId);
        if(!order) {
            return res.status(404).json({message : "Order not found"});
        };
        res.status(200).json({message : "Order fetched successfully" , order});
    }catch(err){
        next(err);
    }
}


const updateOrderStatusHandler = async(req,res,next) => {
    try{
        const orderId = parseInt(req.params.orderid);
        const status = req.body.status;

        const order = await updateOrderStatusService(orderId , status);
        if(!order) {
           return res.status(404).json({message : "Order not found"});
        };
        res.status(200).json({message : "Order status updated successfully" , order});


    }catch(err){
        next(err);
    }

}

module.exports = {
    createUserOrderHandler,
    getOrderByIdHandler,
    updateOrderStatusHandler,
    getAllOrdersHandler,
    getOrderByIdAdminHandler,
    orderCancellationHandler
}