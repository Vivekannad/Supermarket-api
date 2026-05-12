const pool = require('../../src/config/db.js');


const createProductsTable = async () => {
    const query =
    `CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    stock INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
;

    try {
        await pool.query(query);
        console.log('Products table created successfully');
    } catch (err) {
        console.error('Error creating products table', err);
    }
}

module.exports = {createProductsTable};