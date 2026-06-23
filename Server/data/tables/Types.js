const pool = require('../../src/config/db.js');

const createTypes = async () => {
    const query = `
    
    DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
    Exception when duplicate_object then null;
    END $$;

    DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed');
    Exception when duplicate_object then null;
    END $$;

    DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending' ,  'confirmed' , 'shipped' , 'delivered' , 'cancelled');
    Exception when duplicate_object then null;
    END $$;

    `;

    try {
        await pool.query(query);
        console.log('Types successfully created successfully');
    } catch (err) {
        console.error('Error creating types', err);
    }

}

module.exports = {createTypes};