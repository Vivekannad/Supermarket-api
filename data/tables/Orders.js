const pool = require('../../src/config/db.js');

const createOrdersTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        address_id INTEGER NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        status order_status NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (address_id) REFERENCES address(id) ON DELETE CASCADE
);
    `;
    try {
        await pool.query(query);
        console.log('Orders table created successfully');
    } catch (err) {
        console.error('Error creating Orders table:', err);
    }   
}

module.exports = {createOrdersTable};