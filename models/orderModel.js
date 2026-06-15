const pool = require("../src/config/db.js");

const createUserOrderService = async(user_id , cartItemsId , addressData) => {

    // verify user with its order
    const cartedItems = await pool.query("Select * from cart_view where user_id = $1 and cart_item_id = ANY($2)" , [user_id , cartItemsId]);


    if(cartedItems.rows.length === 0 || cartedItems.rows.length != cartItemsId.length){
        const err = new Error("Invalid cart items");
        err.statusCode = 400;
        throw err;
    }

    // check stock 

    for(const item of cartedItems.rows){
        const {rows} = await pool.query("SELECT stock from products where id = $1" , [item.product_id]);

        if(rows[0].stock < item.quantity){
            const err = new Error("Insufficient stock");
            err.statusCode = 400;
            throw err;
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

    const order = await pool.query("SELECT * FROM orders_view where order_id = $1", [orderResult.rows[0].id]);

    return order.rows[0];
    }
    catch(err){
        await pool.query("ROLLBACK");
        throw err;
    }
}



const getOrderByIdService = async(orderId,userId) => {
    const result = await pool.query("SELECT * FROM orders_view WHERE order_id = $1 and user_id = $2", [orderId,userId]);
    return result.rows[0];
}

const getAllOrdersService = async() => {
    const result = await pool.query("SELECT * FROM orders_view");
    return result.rows;
}

const getOrderByIdAdminService = async(orderId) => {
    const result = await pool.query("SELECT * FROM orders_view WHERE order_id = $1", [orderId]);
    return result.rows[0];
}

const updateOrderStatusService = async(orderId , status , userId = null) => {

    //  check if status given is cancelled then check order status is pending , if not throw error
    // if order status is pending , cancel the order and restock the stock
    // if status is delievered , then update the order and also update the payment satus to paid

    const query = userId ? "SELECT * FROM orders where id = $1 and user_id = $2" : "SELECT * FROM orders where id = $1";
    const params = userId ? [orderId,userId] : [orderId];
    const orders = await pool.query(query, params);
    const order = orders.rows[0];
    if(!order){
        const err = new Error("Order not found");
        err.statusCode = 404;
        throw err;
    }
    

    await pool.query("BEGIN");

    try {
        if(status === 'cancelled'){
            //if user cancels the order, first check if the order is not confirmed , is still in pending status.
           if(order.status != "pending"){
                await pool.query("ROLLBACK");
                const err = new Error("Order is not in pending status");
                err.statusCode = 400;
                throw err;
           }

           const updatedResult = await pool.query("UPDATE orders set status = $1 where id = $2 RETURNING *" , [status , orderId]);
           
           // restocking the stock

           const orderItems = await pool.query("SELECT * FROM order_items where order_id = $1", [orderId]);

           for (const item of orderItems.rows){
               await pool.query("UPDATE products SET stock = stock + $1 WHERE id = $2", [item.quantity , item.product_id]);
           }
           return updatedResult.rows[0];
        }

        if(order.status === 'cancelled'){
            await pool.query("ROLLBACK");
            const err = new Error("Order is already cancelled");
            err.statusCode = 400;
            throw err;
        }
        // updating the status of the order
        const updatedResult =await pool.query("UPDATE orders SET status = $1 WHERE id = $2 RETURNING *", [status , orderId]);
        
        if(status === "delivered"){

            // updating the payment status
            await pool.query("UPDATE payment SET status = $1 , paid_at = CURRENT_TIMESTAMP WHERE order_id = $2", ["paid" , orderId]);
        }

        await pool.query("COMMIT");

        return updatedResult.rows[0];

    }catch(err){
        await pool.query("ROLLBACK");
        throw err;
    }
}

module.exports = {
    createUserOrderService,
    getOrderByIdService,
    getAllOrdersService,
    getOrderByIdAdminService,
    updateOrderStatusService
}