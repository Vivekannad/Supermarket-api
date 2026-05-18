const pool = require("../src/config/db.js");

const getAllProductsService = async (minprice, maxprice, limit, page) => {
    const result = await pool.query("SELECT * FROM products_view WHERE product_price between $1 AND $2 LIMIT $3 OFFSET $4", [minprice, maxprice, limit, (page - 1) * limit]);
    return result.rows;

}

const getProductByIdService = async (id) => {
    const result = await pool.query("SELECT * FROM products_view where product_id = $1", [id]);
    return result.rows[0];
}

const getAllCategoriesService = async () => {
    // const result = await pool.query("SELECT distinct category_name FROM products_view");
    const result = await pool.query("SELECT * FROM categories");
    return result.rows;
}

const getProductsByCategoryService = async (category) => {
    const result = await pool.query("SELECT * FROM products_view where category_name like '%' || $1 || '%'", [category]);
    return result.rows;
}


// admin products model queries

// add product query
const addProductService = async (product) => {
    // if a product category is not in the categories table then give error
    // if a product category is in the categories table then add the product in the products table and also fetch the category id from categories table and then add both product_id and category_id in the product_categories table
    const { name, description, price,  stock , category_ids } = product;

    try{
        await pool.query("BEGIN");

        // check in the categories table if the category is already present or not
        const foundedCategories = await pool.query("SELECT * FROM categories where id = ANY($1)", [category_ids]);
    
        // if even one category is not present in the categories table fro the given category_ids from admin then we will give error to the admin to add the category first and then add the product
        if(foundedCategories.rows.length != category_ids.length){
            throw new Error("One or more categories are not present in the categories table. Please add the category first and then add the product.");
        }
        
        // now , here categories are already present in the categories table 
        // now , add the product in the products table first and then fetch that prouct_id and then add the product_id with the respective category_id in the product_cateogories table
        const productResult = await pool.query("INSERT INTO products (name , description , stock , price) values ($1 , $2 , $3 ,$4) RETURNING *", [name , description , stock , price]);

        const productId = productResult.rows[0].id;

        // add the product_id with the respective category_id in the product_cateogories table
        for(let categoryId of category_ids){
            await pool.query("INSERT INTO product_categories (product_id , category_id) values ($1 , $2)", [productId , categoryId]);
        }

        await pool.query("COMMIT");

        return productResult.rows[0];

    }catch(err){
        await pool.query("ROLLBACK");
        throw err;
    }
    
};


const addCategoryService = async (category = '') => {
    // in this , we'll add category in the categories table and then return the category details to the admin
    // we'll be given category name from the admin

    // first , we'll check if the category is already present in the categories table or not

    // convert category into lowercase and add _ in place of space and then check in the categories table if the category is already present or not
    category = category.toLowerCase().replace(/ /g, '_');
    try {
        const { rows: foundedCategory } = await pool.query("SELECT * FROM categories where name = $1", [category]);
        if(foundedCategory.length > 0){
            throw new Error("Category is already present in the categories table. Please add a new category.");
        }
        
        // category is not already present in the categories table , so we can insert the new category in the category table
        const result = await pool.query("INSERT INTO categories (name) values ($1) RETURNING *" , [category]);
        
        
        return result.rows[0];
    } catch (err) {
        throw err;
    }

}

// it is used to edit the product details by the admin
const editProductService = async (product) => {

    // first , check if there are category_ids given then if they are all in category table or not.
    // if not , return error and if yes  , then continue
    // then update the product in the products table
    // if update function returns emoty array then rollback the transaction
    // then return the error
    // then delete the product from product_categories table
    // then iterate over category_ids and add the product_id and category_id in the product_categories table
    // reason we are deleting first all the product records in the product_categories table is if the product has first 3 categories
    //  and then after updating we should have 2 , where would the third one go ? so we have to delete all the records first and then add the new ones

    const { id , name , description , price , stock , category_ids } = product;
    try {
        await pool.query("begin");

        if(category_ids && category_ids.length > 0){
            const result = await pool.query("SELECT * FROM categories where id = ANY($1)", [category_ids]);
            if(result.rows.length != category_ids.length){
                throw new Error("One or more categories are not present in the categories table. Please add the category first and then add the product.");
            }
        }

        // COALSCE is a function that handles null values
        // if first argument is null , then it will return the second argument
        const result = await pool.query(`UPDATE products SET
           name = COALESCE($1, name), description = COALESCE($2, description) , price =  COALESCE($3, price) , stock = COALESCE($4 , stock) where id = $5 RETURNING *` , [name , description , price , stock , id]);

        if(result.rows.length == 0){
            throw new Error("Product not found");
        }

        // if there are category_ids to be changed , then delete the product record from product_categories table
        if(category_ids && category_ids.length > 0){
            // deleting product record from product categories table
            await pool.query("DELETE FROM product_categories where product_id = $1", [id]);
            
            // adding product record in product categories table with updated product caetogories
            for(let categoryId of category_ids){
                await pool.query("INSERT INTO product_categories (product_id , category_id) values ($1 , $2)", [id , categoryId]);
            }
        }

        // commit the transaction
        await pool.query("COMMIT");

        return result.rows[0];
    }catch(err) {
        await pool.query("ROLLBACK");
        throw err;
    }
}

// it is used to remove the product by the admin
const removeProductService = async (id) => {
    // first check if the product is present in the products table or not
    // If yes, then delete the product from products table
    // then  , delete the product record from product_cateogories table
    try {
        const result = await pool.query("DELETE FROM products where id = $1 RETURNING *", [id]);
        if(result.rows.length == 0){
            throw new Error("Product not found");
        }
        await pool.query("DELETE FROM product_categories where product_id = $1", [id]);
        return result.rows[0];
    } catch (err) {
        throw err;
    }
}

module.exports = {
    getAllProductsService,
    getProductByIdService,
    getAllCategoriesService,
    getProductsByCategoryService,
    addProductService,
    addCategoryService,
    editProductService,
    removeProductService
}

