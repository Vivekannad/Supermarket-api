const JOI = require("joi");

JOI.objectId = require("joi-objectid")(JOI);

const productSchema = JOI.object({
    name : JOI.string().min(3).max(100).required(),
    description : JOI.string().min(10).max(500).required(),
    price : JOI.number().positive().required(),
    stock : JOI.number().integer().min(0).required(),
    category : JOI.string().min(3).max(50).required()
})

const validateProduct = (req,res,next) => {
    const {error} = productSchema.validate(req.body);
    if(error){
        return res.status(400).json({message : error.details[0].message});
    }
    next();
}

module.exports = {
    validateProduct
}