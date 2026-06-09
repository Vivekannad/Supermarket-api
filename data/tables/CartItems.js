const pool = require("../../src/config/db.js")


const createCartItemsTable = async () => {
    try {

        const query = `
            CREATE TABLE IF NOT EXISTS cart_items (
            id SERIAL PRIMARY KEY , 
            cart_id integer not null ,
            product_id integer not null ,
            quantity integer not null check (quantity > 0) default 1 ,
            FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )
        `;
        await pool.query(query);
        console.log("Cart items table created successfully")

    }catch(err) {
        console.error("Error creating Cart items table:", err);
    }
}

module.exports = { createCartItemsTable };