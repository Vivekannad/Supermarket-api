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

const validateRegister = (req,res,next) => {
    const {error} = registerSchema.validate(req.body);
    if(error){
        return res.status(400).json({message : error.details[0].message});
    }
    next();
}

const validateLogin = (req,res,next) => {
    const {error} = loginSchema.validate(req.body);
    if(error){
        return res.status(400).json({message : error.details[0].message});
    }
    next();
}

module.exports = {
    validateRegister,
    validateLogin
}