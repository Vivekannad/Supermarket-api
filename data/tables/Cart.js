const pool = require("../../src/config/db.js")


const createCartTable = async () => {
    try {

        const query = `
            CREATE TABLE IF NOT EXISTS cart (
            id SERIAL PRIMARY KEY,
            user_id integer not null ,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        `;
        await pool.query(query);
        console.log("Cart table created successfully")

    }catch(err) {
        console.error("Error creating Cart table:", err);
    }
}

module.exports = { createCartTable };