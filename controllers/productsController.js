const { getAllProductsService, getAllCategoriesService, getProductByIdService, addProductService, addCategoryService, getProductsByCategoryService } = require("../models/productsModel");


//======================= user products controllers ====================

const getAllProductsHandler = async(req,res, next) => {
    try {
        const { minprice = 0, maxprice = Infinity, page = 1, limit = 10 } = req.query;
        const products = await getAllProductsService( minprice, maxprice, limit, page );
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
}


const getAllCategoriesHandler = async(req,res,next) => {
    try {
        const categories = await getAllCategoriesService();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
}

const searchProductsByCategoryHandler = async(req,res,next) => {
    try {
        const {category} = req.params;
        const products = await getProductsByCategoryService(category);
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }

}

const getProductByIdHandler = async(req,res,next) => {
    try {
        const {id} = req.params;
        const product = await getProductByIdService(id);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
}


// ======================= admin products controllers ====================

const addProductHandler = async (req, res , next) => {
    const {name='' , description , price , stock , category_ids} = req.body;
    name = name.toLowerCase();
    try {
        // add product 
        const product = await addProductService({name , description , price , stock , category_ids});
        res.status(201).json({message : "Product added successfully" , product});
    }catch(err){
        console.error(err);
        next(err);
    }
}

const addCategoryHandler = async (req, res, next) => {
    const { name } = req.body;
    try {
        const category = await addCategoryService(name);
        res.status(201).json({ message: "Category added successfully", category });
    } catch (error) {
        next(error);
    }

}

const editProductHandler = async (req, res, err) => {
}

const removeProductHandler = async (req, res) => {

}


module.exports = {
    getAllProductsHandler,
    getAllCategoriesHandler,
    searchProductsByCategoryHandler,
    getProductByIdHandler,
    addProductHandler,
    addCategoryHandler,
    editProductHandler,
    removeProductHandler
}