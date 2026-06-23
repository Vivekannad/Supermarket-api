const pool = require('../../src/config/db.js');


const createCategoriesTable = async () => {
    const query = `CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;
    try {
        await pool.query(query);
        console.log('Categories table created successfully');
        } catch (err) {
            console.error('Error creating categories table', err);
        }   
}

module.exports = { createCategoriesTable };