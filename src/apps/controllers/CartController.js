const Cart = require('../models/cart')

const CartController = {

    //[GET] /api/cart/:id(user)
    index: (req, res, next) => {
        Cart.find({ user: req.params.id }).populate("product")
            .then((cart) => res.json(cart))
            .catch(next)
    },
    //[POST] /api/cart/create/
    create: async (req, res, next) => {
        try {
            const findCart = await Cart.findOne({ user: req.body.user , product: req.body.product })
            if (findCart) {
                await Cart.updateOne({ user: req.body.user , product: req.body.product }, { quantity: findCart.quantity + req.body.quantity })
                res.status(200).json({ status: true })
            } else {
                const cart = new Cart(req.body)
                await cart.save()
                res.status(200).json({ status: true })

            }
        }catch{
            res.status(500).json({ status: false })

        }
    },
    //[DELETE] /api/cart/delete/:id xóa sản phẩm ra khỏi giỏ hàng
    deleteProtoCart:async (req, res, next) => {
        try{
           await Cart.deleteOne({_id:req.params.id})
           res.status(200).json({ status: true })

        }catch{
            res.status(500).json({ status: false })

        }
    },


    //[DELETE] /api/cart/deleteAll/:uid  xóa giỏ hàng của 1 ng khi đặt hàng
    deleteCart:async (req, res, next) => {
        try{
           await Cart.deleteMany({user:req.params.uid})
           res.status(200).json({ status: true })

        }catch{
            res.status(500).json({ status: false })

        }
    },

    //[PUT] /api/cart/update/  
    updateCart:async (req, res, next) => {
        try{
           await Cart.updateOne({user:req.body.user,product:req.body.product},{quantity:req.body.quantity})
           res.status(200).json({ status: true })

        }catch{
            res.status(500).json({ status: false })

        }
    },





}

module.exports = CartController