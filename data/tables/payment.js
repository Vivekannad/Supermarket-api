const pool = require('../../src/config/db.js');

const createPaymentTable = async () => {
    const query = `
   
    
    CREATE TABLE IF NOT EXISTS payment (
    id SERIAL PRIMARY KEY ,
    order_id INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    paid_at Timestamp,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    UNIQUE(order_id)
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