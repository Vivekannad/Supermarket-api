const pool = require("../src/config/db.js");

const findCartIdByUserIdService = async(userId) => {
    const query = "SELECT id FROM cart WHERE user_id = $1";
    const result = await pool.query(query, [userId]);
    return result.rows[0].id;
};

const addCartItemsService = async (productId, cartId, quantity) => {

  // check product exists and has enough stock
  const productResult = await pool.query(
    `SELECT stock FROM products WHERE id = $1`,
    [productId]
  );

  if (!productResult.rows[0]) {
    throw new Error('Product not found');
  }

  // check existing quantity in cart
  const { rows: existing } = await pool.query(
    `SELECT quantity FROM cart_items WHERE product_id = $1 AND cart_id = $2`,
    [productId, cartId]
  );

  const existingQty = existing.length > 0 ? existing[0].quantity : 0;
  const totalQty = existingQty + quantity;

  if (totalQty > productResult.rows[0].stock) {
    throw new Error(`Insufficient stock. Only ${productResult.rows[0].stock - existingQty} more available`);
  }

  // upsert — insert or update quantity if already exists
  const result = await pool.query(
    `INSERT INTO cart_items (cart_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (cart_id, product_id)
     DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
     RETURNING *`,
    [cartId, productId, quantity]
  );

  // return view level data
  const { rows } = await pool.query(
    `SELECT * FROM cart_view WHERE cart_item_id = $1`,
    [result.rows[0].id]
  );

  return rows[0];
};

const removeFromCartService = async (cartItemId, user_id) => {

   const {rows : cartItem} = await pool.query("SELECT * FROM cart_view where cart_item_id = $1 and user_id = $2" , [cartItemId , user_id]);

   if(cartItem.length === 0) return null;

  const result = await pool.query(
    `DELETE FROM cart_items
     WHERE id = $1
     AND cart_id = (SELECT id FROM cart WHERE user_id = $2)
     RETURNING *`,
    [cartItemId, user_id]
  );


  return cartItem[0];
};


const viewCartService = async(userId) => {
    console.log("user id" + userId);
    const result = await pool.query("SELECT * FROM cart_view WHERE user_id = $1", [userId]);
    return result.rows;
}

module.exports = {
    findCartIdByUserIdService ,
    addCartItemsService , 
    removeFromCartService , 
    viewCartService
}