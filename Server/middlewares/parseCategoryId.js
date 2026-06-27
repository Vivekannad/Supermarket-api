const parseCategoryIds = (req,res,next) => {
    if(req.body.categoryIds && typeof req.body.categoryIds === 'string') {
        try{
            const categoryIds = req.body.categoryIds;
            req.body.categoryIds = JSON.parse(categoryIds);
            console.log(req.body.categoryIds);
            const price = req.body.price;
            req.body.price = Number(price);
            const stock = req.body.stock;
            req.body.stock = Number(stock);
        }catch(err){
            return res.status(400).json({message : "Invalid categoryIds"});
        }
    }
    next();
}

module.exports = {parseCategoryIds}