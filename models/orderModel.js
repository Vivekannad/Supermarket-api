const pool = require("../src/config/db.js");

const createUserOrderService = async(user_id , cartItemsId , addressData) => {

    // verify user with its order
    const cartedItems = await pool.query("Select * from cart_view where user_id = $1 and cart_item_id = ANY($2)" , [user_id , cartItemsId]);


    if(cartedItems.rows.length != cartItemsId.length){
        throw new Error("Invalid cart items");
    }

    // check stock 

    for(const item of cartedItems.rows){
        const {rows} = await pool.query("SELECT stock from products where id = $1" , [item.product_id]);

        if(rows[0].stock < item.quantity){
            throw new Error("Insufficient stock");
        }
    }


    // find the total of the ordered items
    const total = cartedItems.rows.reduce((acc , item) => acc + item.sub_total , 0);

    await pool.query("BEGIN");


    try {

    //look if the user already has address in the system or ask for address

    let address;

    if(addressData){

        const {street, city, state, zip, country} = addressData;

        const result = await pool.query(`
                INSERT INTO address (user_id, street, city, state, zip, country)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (user_id) 
                DO UPDATE SET street = EXCLUDED.street, city = EXCLUDED.city, state = EXCLUDED.state, zip = EXCLUDED.zip, country = EXCLUDED.country
                Returning *
        `, [user_id, street, city, state, zip, country]
            );

        address = result.rows[0];

    }else {
        const userAddress = await pool.query("SELECT * FROM address where user_id = $1", [user_id]);
        address = userAddress.rows[0];

        if(!address){
            await pool.query("ROLLBACK");
            throw new Error("Address is required for placing an order");
        }

    }

    // create the order

    const orderResult = await pool.query(`
        INSERT INTO orders (user_id, address_id, total)
        VALUES ($1, $2, $3 )
        RETURNING *
    `, [user_id, address.id, total]);

    // copy to order_items table and deduct the stock from products table
    for(const item of cartedItems.rows){
        await pool.query(`
            INSERT INTO order_items (order_id, product_id, quantity, unit_price)
            VALUES ($1, $2, $3, $4)
        `, [orderResult.rows[0].id, item.product_id, item.quantity, item.product_price]);

        await pool.query(`
            UPDATE products SET stock = stock - $1 WHERE id = $2
        `, [item.quantity, item.product_id]);
    }
   

    // delete the selected items from cart
    await pool.query(`
        DELETE FROM cart_items WHERE id = ANY($1)
    `, [cartItemsId]);

    await pool.query("INSERT INTO payment(order_id , amount ) values ($1 , $2)", [orderResult.rows[0].id , orderResult.rows[0].total]);
    

    await pool.query("COMMIT");

    return orderResult.rows[0];
    }
    catch(err){
        await pool.query("ROLLBACK");
        throw err;
    }
}


const getUserOrdersService = async(userId) => {
    const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [userId]);
    return result.rows;
}

const getOrderByIdService = async(orderId,userId) => {
    const result = await pool.query("SELECT * FROM orders WHERE id = $1 and user_id = $2", [orderId,userId]);
    return result.rows[0];
}

const getAllOrdersService = async() => {
    const result = await pool.query("SELECT * FROM orders");
    return result.rows;
}

const getOrderByIdAdminService = async(orderId) => {
    const result = await pool.query("SELECT * FROM orders WHERE id = $1", [orderId]);
    return result.rows[0];
}

const updateOrderStatusService = async(orderId , status) => {
    const result = await pool.query("UPDATE orders SET status = $1 WHERE id = $2 RETURNING *", [status , orderId]);
    return result.rows[0];
}

module.exports = {
    createUserOrderService,
    getUserOrdersService,
    getOrderByIdService,
    getAllOrdersService,
    getOrderByIdAdminService,
    updateOrderStatusService
}