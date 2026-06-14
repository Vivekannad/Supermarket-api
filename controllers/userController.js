const { getUserAddressService, updateAddressService, updatePasswordService, updateUserInfoService, getUserInfoService, getUserOrdersService } = require("../models/userModel");

const getUserAddressHandler = async(req,res,next) => {
    try{
        const userId = parseInt(req.user.id);
        const address = await getUserAddressService(userId);
        res.status(200).json({message : "User address fetched successfully", address});

    }catch(err) {
        next(err);
    }
}


const getUserInfoHandler = async(req,res,next) => {

    try {

        const userId = parseInt(req.user.id);
    
        const info = await getUserInfoService(userId);
        res.status(200).json({message : "User info fetched successfully", username : info.username , email : info.email , role : info.role});
    }catch(err){
        next(err);
    }
}

const updateUserInfoHandler = async(req,res,next) =>  {
    try {
        const userId = parseInt(req.user.id);

        const {username , email} = req.body;

        const info = await updateUserInfoService(userId, {username , email});
        res.status(200).json({message : "User info updated successfully", username : info.username , email : info.email});

    }catch(err){
        next(err);
    }

}

const updatePasswordHandler = async(req,res,next) => {
    try{
        const userId = parseInt(req.user.id);

        const {oldPass , newPass} = req.body;

        const info = await updatePasswordService(userId , oldPass , newPass);
        res.status(200).json({message : "User password updated successfully",username : info.username , email : info.email });

    }catch(err){
        next(err);
    }

}

const updateAddressHandler = async(req,res,next) => {
    try{
        const userId = parseInt(req.user.id);

        const address = req.body.address;

        const info = await updateAddressService(userId , address);
        res.status(200).json({message : "User address updated successfully", info});

    }catch(err){
        next(err);
    }

}

const getUserOrdersHandler = async(req,res,next) => {
    try{

        const userId = parseInt(req.user.id);
        const orders = await getUserOrdersService(userId);
        res.status(200).json({message : "User orders fetched successfully", orders});

    }catch(err){
        next(err);
    }
}

module.exports = {
    getUserAddressHandler,
    getUserInfoHandler,
    updateUserInfoHandler,
    updatePasswordHandler,
    updateAddressHandler,
    getUserOrdersHandler
}