const pool = require("../src/config/db");

const registerUserService = async(userData) => {
    const {username , email , password , role} = userData;
    const query = "INSERT INTO users (username , email , password , role) VALUES  ($1 , $2 , $3 , $4) RETURNING * ";
    const values = [username , email , password , role];
    const result = await pool.query(query, values);
    return result.rows[0];
}

const loginUserService = async(email) => {
    const query = "SELECT * FROM users WHERE email = $1";
    const value = [email];
    const result = await pool.query(query, value);
    return result.rows[0];
}

module.exports = {
    registerUserService,
    loginUserService
}