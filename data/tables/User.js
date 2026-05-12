const pool = require('../../src/config/db.js');

const createUserTable = async () => {
    const query = `
    
    CREATE TYPE user_role AS ENUM ('user', 'admin');

    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    );`;

    try {
        await pool.query(query);
        console.log('Users table created successfully');
    } catch (err) {
        console.error('Error creating users table', err);
    }

}

module.exports = {createUserTable};