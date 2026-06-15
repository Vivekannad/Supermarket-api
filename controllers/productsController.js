const { getAllProductsService, getProductsByCategoryIdService, getProductByIdService, addProductService, addCategoryService, getProductsByCategoryService, removeProductService, editProductService, getAllCategoriesService } = require("../models/productsModel");


//======================= user products controllers ====================

const getAllProductsHandler = async(req,res, next) => {
    try {
        let { minprice = 0, maxprice = Infinity, page = 1, limit = 10 } = req.query;
        limit = Math.min(limit , 10); // limit the number of produts per page to max 10;
        const products = await getAllProductsService( minprice, maxprice, limit, page );
        res.status(200).json({message : "Successfully fetched all products" , products : products} );
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
        const categoryId = Number(req.params.categoryId);
        const products = await getProductsByCategoryIdService(categoryId);
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }

}

const getProductByIdHandler = async(req,res,next) => {
    try {
        const id = Number(req.params.id);
        const product = await getProductByIdService(id);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
}


// ======================= admin products controllers ====================

const addProductHandler = async (req, res , next) => {
    const {name='' , description= '', price = 0.00 , stock = 0, categoryIds=[]} = req.body;
    try {
        // add product 
        const product = await addProductService({name , description , price , stock , categoryIds});
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

const editProductHandler = async (req, res, next) => {
    const { id } = req.params;
    const {name , description , price , stock , categoryIds} = req.body;

    try {

        const product = await editProductService({id , name , description , price , stock , categoryIds});
        res.status(200).json({message : "Product edited successfully" , product});

    }catch(err){
        next(err);
    }
}

const removeProductHandler = async (req, res , next) => {

    const {id} = req.params;

    try{

        const product = await removeProductService(id);
        res.status(200).json({message : "Product removed successfully" , product});

    }catch(err){
        next(err);
    }

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