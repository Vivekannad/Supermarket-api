const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    const token = jwt.sign({id : user.id , role : user.role} , process.env.ACCESS_KEY_SECRET , {expiresIn : "1h"});
    return token;
}

const verifyToken = (token) => {
    try{
        const decoded = jwt.verify(token , process.env.ACCESS_KEY_SECRET);
        return decoded;
    }catch(err){
        return null;
    }
}

module.exports = {
    generateToken , 
    verifyToken
}