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