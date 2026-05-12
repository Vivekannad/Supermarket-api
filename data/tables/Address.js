const pool = require('../../src/config/db.js');


const createAddressTable = async () => {
    const query = `CREATE TABLE IF NOT EXISTS address (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip VARCHAR(20) NOT NULL,
    country VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`;

    try {
        await pool.query(query);
        console.log('Address table created successfully');
    } catch (error) {
        console.error('Error creating address table:', error);
    }
}

module.exports = { createAddressTable };