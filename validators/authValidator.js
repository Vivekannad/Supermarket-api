const JOI = require("joi");

const registerSchema = JOI.object({
    username : JOI.string().min(3).max(30).required(),
    email : JOI.string().email().required(),
    password : JOI.string().min(3).required(),
    role : JOI.string().valid("admin" , "user").required()
})

const loginSchema = JOI.object({
    email : JOI.string().email().required(),
    password : JOI.string().min(3).required()
});

module.exports = {
    registerSchema,
    loginSchema
}