const JOI = require("joi");

const createOrderSchema = JOI.object({
    cartItemIds : JOI.array().items(JOI.number().integer().required()).min(1).required(),
    address : JOI.object({
        street : JOI.string().min(3).required(),
        city : JOI.string().min(3).required(),
        state : JOI.string().min(3).required(),
        zip : JOI.string().min(3).required(),
        country : JOI.string().min(3).required()
    }).optional()
})

const updateOrderStatusSchema = JOI.object({
    status : JOI.string().valid("pending" , "confirmed" , "shipped" , "delivered" , "cancelled").required()
})

module.exports = {
    createOrderSchema,
    updateOrderStatusSchema
};

