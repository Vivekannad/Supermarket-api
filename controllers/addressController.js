const getUserAddressHandler = (req,res,next) => {
    try{

        const address = getuserAddressService(req.user);
        res.status(200).json({message : "User address fetched successfully", address});

    }catch(err) {
        next(err);
    }
}

module.exports = {getUserAddressHandler}