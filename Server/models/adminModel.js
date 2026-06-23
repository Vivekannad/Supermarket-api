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

const getAdminStatsService = async() => {
    const { rows } = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM users WHERE role = 'user')                       AS total_users,
      (SELECT COUNT(*) FROM products )                                       AS total_products,
      (SELECT COUNT(*) FROM orders)                                          AS total_orders,
      (SELECT COUNT(*) FROM orders WHERE status = 'pending')                  AS pending_orders,
      (SELECT COUNT(*) FROM orders WHERE status = 'delivered')                AS delivered_orders,
      (SELECT COUNT(*) FROM orders WHERE status = 'cancelled')                AS cancelled_orders,
      (SELECT COALESCE(SUM(total), 0)::float FROM orders WHERE status != 'cancelled' and status != 'pending' ) AS total_revenue,
      (SELECT COUNT(*) FROM products WHERE stock = 0 )    AS out_of_stock_products
  `);

  return rows[0];
}


module.exports = {
    getAllUsersService ,
    getUserService,
    getAdminStatsService
}