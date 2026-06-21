const pool = require('../../src/config/db');

const createOrderView = async () => {
  await pool.query('DROP VIEW IF EXISTS orders_view');

  await pool.query(`
    CREATE OR REPLACE VIEW orders_view AS
    SELECT
      o.id              AS order_id,
      o.user_id,
      u.username,
      o.status,
      o.total::float    AS total,
      ARRAY_AGG(
        json_build_object(
          'order_item_id', oi.id,
          'product_id', p.id,
          'product_name', p.name,
          'product_price', p.price::float,
          'product_image', p.image,
          'quantity', oi.quantity,
          'sub_total', (oi.quantity * p.price)::float
        )
      ) AS items
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p     ON p.id = oi.product_id
    JOIN users u        ON u.id = o.user_id
    GROUP BY o.id, o.user_id, u.username, o.status, o.total
  `);

  console.log('Orders_view created successfully');
};

module.exports = { createOrderView };