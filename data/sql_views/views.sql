CREATE OR REPLACE VIEW products_view AS
        SELECT 
        p.id AS product_id,
        p.name AS product_name,
        p.description AS product_description,
        p.price AS product_price,
        c.name AS category_name,
        p.stock AS product_stock,
        p.created_at AS product_created_at
        FROM products p
        JOIN product_categories pc on p.id = pc.product_id
        join categories c
        on c.id = pc.category_id ;


CREATE OR REPLACE VIEW cart_view AS
        SELECT 
        c.user_id AS user_id,
        ci.id as cart_item_id,
        p.id AS product_id,
        p.name AS product_name,
        p.price AS product_price,
        ci.quantity AS quantity,
        (ci.quantity * p.price)::float as sub_total
        from cart_items ci
        join cart c
        on ci.cart_id = c.id
        join products p
        on p.id = ci.product_id;

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
        on u.id = o.user_id;