const { findCartIdByUserIdService, addCartItemsService, removeFromCartService, viewCartService, updateCartService } = require("../models/cartModel");

const addToCartHandler = async(req,res , next) => {
    try {
        const {productId , quantity} = req.body;
        const cartId = await findCartIdByUserIdService(req.user.id);

        const cartItem = await addCartItemsService(productId , cartId , quantity);

        res.status(200).json({message : "Product added to cart successfully", cartItem  })

    }catch(err) {
        next(err);
    }

}

const removeFromCartHandler = async(req,res, next) => {
    try {
        let {cartItemsId} = req.params;
        cartItemsId = parseInt(cartItemsId);

        const removedItem = await removeFromCartService(cartItemsId , req.user.id );
        if(!removedItem) {
            return res.status(404).json({message : "Cart item not found"});
        }
        res.status(200).json({message : "Product removed from cart successfully", removedItem })
    }catch(err) {
       next(err);
    }
}

const viewCartHandler = async(req,res, next) => {
    try {
        const cartItems = await viewCartService(req.user.id);
        res.status(200).json({message : "Cart items retrieved successfully", cartItems });
    } catch(err) {
        next(err);
    }
}

const updateCartHandler = async(req,res,next) => {
    try{

        const cartItemsId = (req.params.id);
        const {quantity} = req.body;
        const userId = Number(req.user.id);
        const cartItem = await updateCartService(cartItemsId , quantity, userId);
        if(!cartItem) {
            return res.status(404).json({message : "Cart item not found"});
        }
        res.status(200).json({message : "Cart item updated successfully", cartItem});

    }catch(err){
        next(err);
    }
}


module.exports = {
    addToCartHandler , 
    removeFromCartHandler , 
    viewCartHandler,
    updateCartHandler
}