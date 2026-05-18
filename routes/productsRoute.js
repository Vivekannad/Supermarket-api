const { addCategoryHandler,  getAllCategoriesHandler, searchProductsByCategoryHandler, getAllProductsHandler, getProductByIdHandler, addProductHandler, editProductHandler, removeProductHandler } = require("../controllers/productsController");
const { restrictTo } = require("../middlewares/authHandler");

const router = require("express").Router();

// ===================== static routes first =====================

router.get("/categories", getAllCategoriesHandler);
router.get("/category/:category", searchProductsByCategoryHandler);
router.get("/", getAllProductsHandler);

// admin static routes — must be above /:id
router.post("/addproduct",  restrictTo(["admin"]), addProductHandler);
router.post("/addcategory", restrictTo(["admin"]), addCategoryHandler);

// ===================== dynamic routes last =====================

router.get("/:id",               getProductByIdHandler);
router.put("/editproduct/:id",   restrictTo(["admin"]), editProductHandler);
router.delete("/removeproduct/:id", restrictTo(["admin"]), removeProductHandler);


module.exports = router;
