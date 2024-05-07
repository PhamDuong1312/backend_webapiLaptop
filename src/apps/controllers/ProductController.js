const Product = require('../models/products')
const Comment = require('../models/comment')
const Cart = require('../models/cart')
const config = require('config')
const fs = require('fs')
const path = require('path')



const ProductController = {

    //[GET] /api/products
    index: async (req, res, next) => {
        const filter=[]
        if(req.filter==="con"){
            filter.push(true)
        }else if(req.filter==="het"){
            filter.push(false)
        }else{
            filter.push(true,false)
        }
        const product = await Product.find({name:{ $regex: req.search, $options:"i" },status:{$in:filter}});
        const total = product.length
        let pageCount = Math.ceil(total / req.pages.limit)
        if (req.pages.currentPage < pageCount) {
            req.pages.hasNext = true;
        }
        Product.find({name:{ $regex: req.search, $options:"i" },status:{$in:filter}})
            .sort({[req.sort.field]:req.sort.type})
            .skip((req.pages.currentPage - 1) * req.pages.limit)
            .limit(req.pages.limit).populate("categoryId")
            .then((product) => res.json({
                data: product,
                total,
                pages: req.pages
            }))
            .catch(next)
    },

     //[GET] /api/products/hot
     productHot: async (req, res, next) => {

        const product = await Product.find({noiBat:true});
        const total = product.length
        let pageCount = Math.ceil(total / req.pages.limit)
        if (req.pages.currentPage < pageCount) {
            req.pages.hasNext = true;
        }

        Product.find({noiBat:true}).skip((req.pages.currentPage - 1) * req.pages.limit).limit(req.pages.limit).populate("categoryId")
            .then((product) => res.json({
                data: product,
                total,
                pages: req.pages
            }))
            .catch(next)
    },

    //[POST] /api/products/create
    create: (req, res, next) => {
        if(Number(req.body.quantity)>0){
            req.body.status=true
        }else{
            req.body.status=false
        }
        const product = new Product({ ...req.body, image: req.file.originalname })
        product.save()
            .then(() => res.status(200).json({
                success: true,
                message: 'success'
            }))
            .catch(err => res.status(500).json({
                success: false,
                message: 'failed'
            }))
    },

    //[GET] /api/products/:id
    getDetail: (req, res, next) => {
        Product.findById(req.params.id).populate("categoryId")
            .then((product) => res.status(200).json({
                status: 'success',
                data: product
            }))
            .catch(err => res.status(500).json({
                status: 'failed',
                data: {}
            }))
    },
    //[PUT] /api/products/edit/:id
    edit: async (req, res, next) => {
        if(Number(req.body.quantity)>0){
            req.body.status=true
        }else{
            req.body.status=false
        }
        
        if (req.file) {
            const product = await Product.findById(req.params.id);
            const imagePath = config.app.static_folder + "/images/" + product.image
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath)
            }
            await Product.updateOne({ _id: req.params.id }, { ...req.body, image: req.file.originalname })
                .then(() => res.status(200).json({
                    status: 'success',
                }))
                .catch(err => res.status(500).json({
                    status: 'failed',
                }))
        } else {
            Product.updateOne({ _id: req.params.id }, req.body)
                .then(() => res.status(200).json({
                    status: 'success',
                }))
                .catch(err => res.status(500).json({
                    status: 'failed',
                }))
        }


    },
    //[DELETE] /api/products/delete/:id
    delete: async (req, res, next) => {
        const product = await Product.findById(req.params.id)
        const imagePath = config.app.static_folder + "/images/" + product.image
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
        }
        await Cart.deleteMany({ product: req.params.id })
        await Comment.deleteMany({ product: req.params.id })
        Product.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({
                status: 'success',
            }))
            .catch(err => res.status(500).json({
                status: 'failed',
            }))
    },
    //[POST] /api/products/deletemany
    deleteMany: async (req, res, next) => {
        const product = await Product.find({_id:{$in:req.body.items}})
        product.forEach((item) => {
            const imagePath = config.app.static_folder + "/images/" + item.image
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath)
            }
        })
        await Cart.deleteMany({ product: {$in:req.body.items} })
        await Comment.deleteMany({ product: {$in:req.body.items} })
        Product.deleteMany({ _id: {$in:req.body.items} })
            .then(() => res.status(200).json({
                status: 'success',
            }))
            .catch(err => res.status(500).json({
                status: 'failed',
            }))
    },
    //[GET] /api/products/category/:id lấy sp theo danh mục
    getproductCategory: async (req, res, next) => {
        const product = await Product.find({ categoryId: req.params.id });
        const total = product.length
        let pageCount = Math.ceil(total / req.pages.limit)
        if (req.pages.currentPage < pageCount) {
            req.pages.hasNext = true;
        }

        Product.find({ categoryId: req.params.id }).skip((req.pages.currentPage - 1) * req.pages.limit).limit(req.pages.limit)
            .then((product) => res.json({
                data: product,
                total,
                pages: req.pages
            }))
            .catch(next)
    },


}

module.exports = ProductController;