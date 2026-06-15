const JOI = require("joi");


const updateUserInfoSchema = JOI.object({
    username : JOI.string().min(3).max(30).optional(),
    email : JOI.string().email().optional()
})

const updateUserPasswordSchema = JOI.object({
    oldPass : JOI.string().min(3).required(),
    newPass : JOI.string().min(3).required()
})

const updateUserAddressSchema = JOI.object({
    address : JOI.object({
        street : JOI.string().min(3).required(),
        city : JOI.string().min(3).required(),
        state : JOI.string().min(3).required(),
        zip : JOI.string().min(3).required(),
        country : JOI.string().min(3).required()
    })
})

module.exports = {updateUserPasswordSchema , updateUserAddressSchema , updateUserInfoSchema};