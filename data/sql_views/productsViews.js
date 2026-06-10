const pool = require("../../src/config/db")

const createProductsView = async () => {
 

  await pool.query(`
    CREATE OR REPLACE VIEW products_view AS
    SELECT
      p.id            AS product_id,
      p.name          AS product_name,
      p.description   AS product_description,
      p.price::float  AS product_price,
      p.stock         AS product_stock,
      p.created_at    AS product_created_at,
      ARRAY_AGG(c.name) AS categories
    FROM products p
    JOIN product_categories pc ON p.id = pc.product_id
    JOIN categories c ON pc.category_id = c.id
    GROUP BY p.id
  `);

  console.log('Products_view created successfully');
};

module.exports = { createProductsView };