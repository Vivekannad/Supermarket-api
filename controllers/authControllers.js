const pool = require("../src/config/db");
const { registerUserService , loginUserService , getAllUsersService } = require("../models/authModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/token");

const registerUser = async(req,res , next) => {
    const {username , email , password , role} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password , 10);
        const registeredUser = await registerUserService({username , email , password : hashedPassword , role});
        if(!registeredUser){
            return res.status(400).json({message : "User already exists"});
        }
        res.status(201).json({message : "User registered successfully", username : registeredUser.username});
    }catch(err){
        next(err);
    }
}

const loginUser = async(req,res , next) => {
    const {email , password} = req.body;

    try{
        const user = await loginUserService(email);

        if(!user){
            return res.status(401).json({message : "Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password , user.password);

        
        if(!isMatch){
            return res.status(401).json({message : "Invalid credentials"});
        }

        const token = generateToken(user);

        res.status(200).json({message : "User logged in successfully", username : user.username, email : user.email, role : user.role, token});
    }catch(err){
        next(err);
    }
}


const logoutHandler = () => {
        // Since JWT is stateless, we cannot invalidate the token on the server side.
        // To "logout" a user, the client should simply delete the token from its storage (e.g., localStorage or cookies).
        // Optionally, you can implement token blacklisting on the server side to invalidate tokens before their expiration time.
        // I want to blacklist the token on logout and it can be before expiry
         

}


module.exports = {
    registerUser,
    loginUser,
    logoutHandler}