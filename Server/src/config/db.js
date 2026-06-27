const {Pool} = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool(
    process.env.DATABASE_URL ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }:
    {
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT,
})

pool.on("connect", () => {
    console.log("Connected to the database");
})

module.exports = pool;