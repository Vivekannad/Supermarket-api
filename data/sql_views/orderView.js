const pool = require("../../src/config/db")

const createOrderView = async () => {
 

  await pool.query(`
   CREATE OR REPLACE VIEW orders_view AS
        SELECT 
        o.id AS order_id,
        o.user_id as user_id,
        u.username AS username,
        o.status AS status,
        oi.id AS order_item_id,
        p.id AS product_id,
        p.name AS product_name,
        p.price::float AS product_price,
        oi.quantity AS quantity,
        (oi.quantity * p.price)::float as sub_total,
        o.total as total
        from orders o
        join order_items oi
        on o.id = oi.order_id
        join products p
        on p.id = oi.product_id
        join users u
        on u.id = o.user_id;`
  );

  console.log('Orders_view created successfully');
};

module.exports = { createOrderView };