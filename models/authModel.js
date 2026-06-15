const pool = require("../src/config/db");

const registerUserService = async(userData) => {
    const {username , email , password , role} = userData;

    // every user has his own  cart created when he registers
    await pool.query("Begin");
    try {

        // checking if the user already exists

        const user = await pool.query("SELECT * FROM users where email = $1" , [email]);
        if (user.rows.length > 0) {
            await pool.query("Rollback");
            return null;
        }

        const query = "INSERT INTO users (username , email , password , role) VALUES  ($1 , $2 , $3 , $4) RETURNING * ";
        const values = [username , email , password , role];
        const result = await pool.query(query, values);

        await pool.query("Insert into cart (user_id) values ($1) " , [result.rows[0].id])

        await pool.query("COMMIT");

        return result.rows[0];

        
    } catch (error) {
        await pool.query("Rollback");
        throw error;
    }
    
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