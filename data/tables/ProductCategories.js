const pool = require("../../src/config/db");

const createProductCategoriesTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS product_categories (
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (category_id , product_id)
    );
    `
    try {
        await pool.query(query);
        console.log("product_categories table created successfully");
    }catch(err){
        console.error("Error creating product_categories table:", err);
    }

}

module.exports = { createProductCategoriesTable };