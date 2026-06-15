const JOI = require("joi");

const addToCartSchema = JOI.object({
    productId : JOI.number().integer().required(),
    quantity : JOI.number().integer().min(1).required()
})

module.exports = {addToCartSchema};