 CREATE OR REPLACE VIEW products_view AS
    SELECT
      p.id            AS product_id,
      p.name          AS product_name,
      p.description   AS product_description,
      p.image         AS product_image,
      p.price::float  AS product_price,
      p.stock         AS product_stock,
      p.created_at    AS product_created_at,
      ARRAY_AGG(c.name) AS categories
    FROM products p
    JOIN product_categories pc ON p.id = pc.product_id
    JOIN categories c ON pc.category_id = c.id
    GROUP BY p.id


CREATE OR REPLACE VIEW cart_view AS
            SELECT 
            c.user_id AS user_id,
            ci.id as cart_item_id,
            p.id AS product_id,
            p.name AS product_name,
            p.price::float AS product_price,
            p.image AS product_image,
            ci.quantity AS quantity,
            (ci.quantity * p.price)::float as sub_total
            from cart_items ci
            join cart c
            on ci.cart_id = c.id
            join products p
            on p.id = ci.product_id;

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
    GROUP BY o.id, o.user_id, u.username, o.status, o.total;