const pool = require('../../src/config/db.js');


const createOrderItemsTable = async() => {
    const query = `
        CREATE TABLE IF NOT EXISTS order_items(
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        unit_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
    `
    try {
        await pool.query(query);
        console.log("order_items table created successfully");
    } catch (err) {
        console.error("Error creating order_items table:", err);
    }
}

module.exports = {
    createOrderItemsTable
}