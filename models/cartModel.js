const pool = require("../src/config/db.js");

const findCartIdByUserIdService = async(userId) => {
    const query = "SELECT id FROM cart WHERE user_id = $1";
    const result = await pool.query(query, [userId]);
    return result.rows[0].id;
};

const addCartItemsService = async(productId , cartId , quantity) => {
    // user can add the same product multiple times, in that case we will update the quantity of that product in the cart instead of adding a new row in the cart_items table

    // what is the user tries to add some quantity that is not in the stock, in that case we will return an error message to the user

    const productQuery = "SELECT stock FROM products WHERE id = $1";
    const productResult = await pool.query(productQuery, [productId]);

    if (!productResult.rows[0]) {
        throw new Error("Product not found");
    }

    if (quantity > productResult.rows[0].stock) {
        throw new Error("Insufficient stock");
    }

    const query = `
        INSERT INTO cart_items (cart_id , product_id , quantity)
        VALUES ($1 , $2 , $3)
        RETURNING *;
    `;

    const result = await pool.query(query, [cartId, productId, quantity]);
    return result.rows[0];
};

const removeFromCartService = async(cartItemsId ) => {
    const query = "DELETE FROM cart_items WHERE id = $1 RETURNING *";
    const result = await pool.query(query, [cartItemsId]);
    return result.rows[0];
}

const viewCartService = async(cartId) => {
    const query = `
        SELECT p.name , p.price , ci.quantity
        from cart_items ci
        join products p on ci.product_id = p.id
        where ci.cart_id = $1
    `;
    const result = await pool.query(query, [cartId]);
    return result.rows;
}

module.exports = {
    findCartIdByUserIdService ,
    addCartItemsService , 
    removeFromCartService , 
    viewCartService
}