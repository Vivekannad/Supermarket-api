const { getUserService, getAllUsersService } = require("../models/adminModel");

const getAllUsersHandler =  async(req,res,next) => {
    try {
        const result = await getAllUsersService();
        res.status(200).json({message : "Users retrieved successfully", users : result});
    } catch (error) {
        next(error);
    }

}

const getUserHandler = async(req,res,next) => {
    try {
        const userId = parseInt(req.params.id);
        const result = await getUserService(userId);
        res.status(200).json({message : "User retrieved successfully", user : result});
    }catch (error) {
        next(error);
    }
}


module.exports ={
    getAllUsersHandler,
    getUserHandler
}