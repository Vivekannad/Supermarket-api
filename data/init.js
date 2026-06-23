const { cartView } = require("./sql_views/cartView");
const { createOrderView } = require("./sql_views/orderView");
const { createProductsView } = require("./sql_views/productsView");
const { createAddressTable } = require("./tables/Address");
const { createCartTable } = require("./tables/Cart");
const { createCartItemsTable } = require("./tables/CartItems");
const { createCategoriesTable } = require("./tables/Categories");
const { createOrderItemsTable } = require("./tables/order_items");
const { createOrdersTable } = require("./tables/Orders");
const { createPaymentTable } = require("./tables/Payment");
const { createProductCategoriesTable } = require("./tables/Product_categories");
const { createProductsTable } = require("./tables/Products");
const { createTypes } = require("./tables/Types");
const { createUserTable } = require("./tables/User");

const initDB = async() => {

    // custom types
    await createTypes();

    // tables
    await createUserTable();
    await createProductsTable(); 
    await createCategoriesTable();
    await createProductCategoriesTable();
    await createCartTable();
    await createCartItemsTable();
    await createAddressTable();
    await createOrdersTable();
    await createOrderItemsTable();
    await createPaymentTable();

    // views
    await createProductsView();
    await cartView();
    await createOrderView();
}

module.exports = { initDB };