const pool = require("../src/config/db")
const bcrypt = require("bcrypt");

const getUserAddressService = async(userId) => {
    const result = await pool.query("SELECT street , city , state , zip , country FROM address WHERE user_id = $1", [userId]);
    return result.rows[0];
}

const getUserInfoService = async(userId) => {
    const result = await pool.query("SELECT * FROM users where id = $1", [userId]);
    return result.rows[0];
}

const updateUserInfoService = async(userId , userInfo = {}) => {
    const {username , email} = userInfo;
    const result = await pool.query("UPDATE users SET username = COALESCE($1, username)  , email = COALESCE($2 , email) where id = $3 RETURNING *" , [username , email , userId]);
    return result.rows[0];
}

const updateUserPasswordService = async(userId , oldPass , newPass) => {

        const userInfo = await getUserInfoService(userId);
        const isMatch = await bcrypt.compare(oldPass , userInfo.password);
        if(!isMatch){
            const err = new Error("Invalid credentials");
            err.statusCode = 401;
            throw err;
        } ;
        const hashedPass = await bcrypt.hash(newPass , 10);
        const result = await pool.query("UPDATE users SET password = $1 where id = $2 RETURNING *" , [hashedPass , userId]);
        return result.rows[0];
    
}

const updateUserAddressService = async(userId , address = {}) => {
    const {street , city , state , zip , country} = address;
    const result = await  pool.query("UPDATE address SET street = $1 , city = $2 , state = $3 , zip = $4 , country = $5 where user_id = $6 RETURNING *" , [street , city , state , zip , country , userId]);
    return result.rows[0];

}

const getUserOrdersService = async(userId) => {
    const result = await pool.query(`SELECT * FROM orders_view WHERE user_id = $1 ` , [userId]);
    return result.rows;
}

module.exports = {
    getUserAddressService ,
    getUserInfoService ,
    updateUserInfoService ,
    updateUserPasswordService,
    updateUserAddressService,
    getUserOrdersService
}