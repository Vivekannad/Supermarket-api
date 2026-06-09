const { findCartIdByUserIdService, addCartItemsService, removeFromCartService, viewCartService } = require("../models/cartModel");

const addToCartHandler = async(req,res) => {
    try {
        const {productId , quantity} = req.body;
        const cartId = await findCartIdByUserIdService(req.user.id);

        const cartItem = await addCartItemsService(productId , cartId , quantity);

        res.status(200).json({message : "Product added to cart successfully", cartItem })

    }catch(err) {
        res.status(500).json({message : "Server side error"});
    }

}

const removeFromCartHandler = async(req,res) => {
    try {
        const {cartItemsId} = req.params;
        cartItemsId = parseInt(cartItemsId);
        const removedItem = await removeFromCartService(cartItemsId);
        if(!removedItem) {
            return res.status(404).json({message : "Cart item not found"});
        }
        res.status(200).json({message : "Product removed from cart successfully", removedItem })
    }catch(err) {
        res.status(500).json({message : "Server side error"});
    }
}

const viewCartHandler = async(req,res) => {
    try {
        const cartId = await findCartIdByUserIdService(req.user.id);
        const cartItems = await viewCartService(cartId);
        res.status(200).json({message : "Cart items retrieved successfully", cartItems });
    } catch(err) {
        res.status(500).json({message : "Server side error"});
    }
}


module.exports = {
    addToCartHandler , 
    removeFromCartHandler , 
    viewCartHandler
}