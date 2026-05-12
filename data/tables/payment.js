const pool = require('../../src/config/db.js');

const createPaymentTable = async () => {
    const query = `
    CREATE TYPE payment_method AS ENUM ('COD', 'CARD');
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed');
    
    CREATE TABLE IF NOT EXISTS payment (
    id SERIAL PRIMARY KEY ,
    order_id INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    method payment_method NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
)
    `

    try {
        await pool.query(query);
        console.log('Payment table created successfully');
    }catch (err) {
        console.error('Error creating payment table:', err);
    }
}

module.exports = { createPaymentTable };