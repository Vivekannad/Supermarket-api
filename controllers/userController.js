const { getUserAddressService,  updateUserInfoService, getUserInfoService, getUserOrdersService, updateUserAddressService, updateUserPasswordService } = require("../models/userModel");

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
        res.status(200).json({message : "User info updated successfully", user : { username : info.username , email : info.email}});

    }catch(err){
        next(err);
    }

}

const updateUserPasswordHandler = async(req,res,next) => {
    try{
        const userId = parseInt(req.user.id);

        const {oldPass , newPass} = req.body;

        const info = await updateUserPasswordService(userId , oldPass , newPass);
        res.status(200).json({message : "User password updated successfully", user : {username : info.username , email : info.email} });

    }catch(err){
        next(err);
    }

}

const updateUserAddressHandler = async(req,res,next) => {
    try{
        const userId = parseInt(req.user.id);

        const address = req.body.address;

        const info = await updateUserAddressService(userId , address);

        if(!info) return res.status(401).json({message : "No Address at first place."});
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
    updateUserPasswordHandler,
    updateUserAddressHandler,
    getUserOrdersHandler
}