const getUserAddressService = (userId) => {
    const result = await pool.query("SELECT street , city , state , zip , country FROM address WHERE user_id = $1", [userId]);
    return result.rows[0];
}

module.exports = {
    getUserAddressService
}