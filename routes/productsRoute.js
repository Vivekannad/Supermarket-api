const { addCategoryHandler,  getAllCategoriesHandler, searchProductsByCategoryHandler, getAllProductsHandler, getProductByIdHandler, addProductHandler, editProductHandler, removeProductHandler } = require("../controllers/productsController");
const { restrictTo } = require("../middlewares/authHandler");

const router = require("express").Router();

//===================== user products routes ====================

// list all categories
router.get("/categories", getAllCategoriesHandler);

// search product by the category name
router.get("/category/:category", searchProductsByCategoryHandler);

// list all products
// it includes the min price and max price query params to filter the products by price range 
// It also includes the pagination query params (page and limit) to paginate the products list
router.get("/", getAllProductsHandler);

// get product by id
router.get("/:id", getProductByIdHandler);


//======================= admin routes ====================


router.post("/addproduct", restrictTo(["admin"]), addProductHandler);

router.post("/addcategory", restrictTo(["admin"]), addCategoryHandler);

router.put("/editproduct/:id", restrictTo(["admin"]), editProductHandler);

router.delete("/removeproduct/:id", restrictTo(["admin"]), removeProductHandler);

module.exports = router;
