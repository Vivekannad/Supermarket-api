const pool = require("../src/config/db");


const getAllUsersService = async() => {
    const query = "SELECT id , username , email , role FROM users";
    const result = await pool.query(query);
    return result.rows;
}

const getUserService = async(id) => {
    const query = "SELECT id , username , email , role FROM users WHERE id = $1";
    const result = await pool.query(query , [id]);
    return result.rows[0];
}


module.exports = {
    getAllUsersService ,
    getUserService
}