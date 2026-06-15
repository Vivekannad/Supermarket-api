const JOI = require("joi");


const addProductSchema = JOI.object({
    name : JOI.string().min(3).max(100).required(),
    description : JOI.string().min(10).max(500).required(),
    price : JOI.number().positive().required(),
    stock : JOI.number().integer().min(1).required(),
    categoryIds : JOI.array().items(JOI.number().integer().required()).min(1).required()
})

const addCategorySchema = JOI.object({
    name : JOI.string().min(3).max(50).required()
})

const editProductSchema = JOI.object({
    name : JOI.string().min(3).max(100).optional(),
    description : JOI.string().min(10).max(500).optional(),
    price : JOI.number().positive().optional(),
    stock : JOI.number().integer().min(0).optional(),
    categoryIds : JOI.array().items(JOI.number().integer().required()).min(1).optional()
})



module.exports = {
    addProductSchema, 
    addCategorySchema,
    editProductSchema
}