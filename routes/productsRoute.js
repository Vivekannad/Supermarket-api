const { addCategoryHandler,  getAllCategoriesHandler, searchProductsByCategoryHandler, getAllProductsHandler, getProductByIdHandler, addProductHandler, editProductHandler, removeProductHandler } = require("../controllers/productsController");
const { restrictTo } = require("../middlewares/authHandler");
const { validate } = require("../middlewares/validateHandler");
const { addProductSchema, addCategorySchema, editProductSchema } = require("../validators/productValidator");

const router = require("express").Router();

// ===================== static routes first =====================

router.get("/categories", getAllCategoriesHandler);
router.get("/category/:categoryId", searchProductsByCategoryHandler);
router.get("/", getAllProductsHandler);

// admin static routes — must be above /:id
router.post("/addproduct",   restrictTo(["admin"]), validate(addProductSchema) , addProductHandler);
router.post("/addcategory",  restrictTo(["admin"]), validate(addCategorySchema) , addCategoryHandler);

// ===================== dynamic routes last =====================

router.get("/:id", getProductByIdHandler);
router.put("/editproduct/:id",   restrictTo(["admin"]), validate(editProductSchema) , editProductHandler);
router.delete("/removeproduct/:id", restrictTo(["admin"]), removeProductHandler);


module.exports = router;
