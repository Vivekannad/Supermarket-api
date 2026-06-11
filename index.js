const express = require('express');
const pool = require('./src/config/db');
const authRoute = require('./routes/authRoute');
const { errorHandler } = require('./middlewares/errorHandler');
const { authHandler } = require('./middlewares/authHandler');
const { createUserTable } = require('./data/tables/User');
const { createProductsView } = require('./data/sql_views/productsViews');
const { createCategoriesTable } = require('./data/tables/Categories');
const { createProductCategoriesTable } = require('./data/tables/ProductCategories');
const { createProductsTable } = require('./data/tables/Products');
const {createCartTable} = require("./data/tables/Cart.js")
const {createCartItemsTable} = require("./data/tables/CartItems.js")
const productsRoute = require("./routes/productsRoute");
const cartRoute = require("./routes/cartRoute.js");
const { cartView } = require('./data/sql_views/cartView.js');
const { createTypes } = require('./data/tables/types.js');
const orderRoute = require("./routes/ordersRoute.js")
const app = express();
const port = 3000;


// for parsing application/json
app.use(express.json());

//testing route
app.get('/', async (req, res) => {
    const result = await pool.query('SELECT current_database()');
    res.json(result.rows[0]);
});

// auth routes
app.use("/api/auth", authRoute);


// protected routes
app.use("/api/products", authHandler , productsRoute );
app.use("/api/cart", authHandler , cartRoute );
app.use("/api/orders", authHandler , orderRoute );


// error handling middleware
app.use(errorHandler);


app.listen(port, async() => {
  await createTypes();
  await createUserTable();
  await createProductsTable(); 
  await createCategoriesTable();
  await createProductCategoriesTable();
  await createProductsView();
  await createCartTable();
  await createCartItemsTable();
  await cartView();
  console.log(`Auth system listening at http://localhost:${port}`);
});