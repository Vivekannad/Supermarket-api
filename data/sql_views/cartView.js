const pool = require("../../src/config/db");


const cartView = async() => {
    try {
        const query = `
        CREATE OR REPLACE VIEW cart_view AS
            SELECT 
            c.user_id AS user_id,
            ci.id as cart_item_id,
            p.id AS product_id,
            p.name AS product_name,
            p.price::float AS product_price,
            ci.quantity AS quantity,
            (ci.quantity * p.price)::float as sub_total
            from cart_items ci
            join cart c
            on ci.cart_id = c.id
            join products p
            on p.id = ci.product_id;
        `;

        await pool.query(query);

        console.log("Cart View Created Successfully");

    }catch(err) {
        console.error("Error creating the view " , err.message);
    }
}

module.exports = { cartView };