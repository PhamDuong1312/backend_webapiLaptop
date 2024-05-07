const Order = require('../models/order');
const OrderItem = require('../models/orderItem')
const Cart = require('../models/cart')
const sendMail = require('../../ultils/index');
const moment = require('moment');
const Product = require('../models/products')
const ejs=require('ejs')
const path = require('path')
const fs=require('fs')
const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
});

const OrderController = {

    //[GET] /api/order
    index: async (req, res, next) => {
        const status = req.filter || "";
        const order = await Order.find({ fullname: { $regex: req.search, $options: "i" }, status: { $regex: status, $options: "i" } });
        const total = order.length
        let pageCount = Math.ceil(total / req.pages.limit)
        if (req.pages.currentPage < pageCount) {
            req.pages.hasNext = true;
        }
        Order.find({ fullname: { $regex: req.search, $options: "i" }, status: { $regex: status, $options: "i" } })
            .sort({ dateOrder: -1 })
            .skip((req.pages.currentPage - 1) * req.pages.limit)
            .limit(req.pages.limit)
            .populate({ path: "items", populate: "product" }).populate("user", "fullName")
            .then((order) => res.json({
                data: order,
                total,
                pages: req.pages
            }))
            .catch(next)
    },
    //[GET] /api/order/:id
    getOrder: (req, res, next) => {
        Order.findById(req.params.id).populate({ path: "items", populate: "product" }).populate("user", "fullName")
            .then((order) => res.json(order))
            .catch(next)
    },
    //[GET] /api/order/bydate
    getOrderByDate: (req, res, next) => {
        const start = new Date(req.query.start)
        const end = new Date(req.query.end)
        Order.find({ dateOrder: { $lte: end, $gte: start }, status: "done" }).populate({ path: "items", populate: "product" }).populate("user", "fullName")
            .then((order) => res.json(order))
            .catch(next)
    },
    //[GET] /api/order/user/:id
    getOrderUser: async (req, res, next) => {
        const order = await Order.find({ user: req.params.id, status: req.query.status });
        const total = order.length
        let pageCount = Math.ceil(total / req.pages.limit)
        if (req.pages.currentPage < pageCount) {
            req.pages.hasNext = true;
        }
        Order.find({ user: req.params.id, status: req.query.status })
            .sort({ dateOrder: -1 })
            .skip((req.pages.currentPage - 1) * req.pages.limit)
            .limit(req.pages.limit)
            .populate({ path: "items", populate: "product" }).populate("user", "fullName")
            .then((order) => res.json({
                data: order,
                total,
                pages: req.pages
            }))
            .catch(next)
    },
    //[POST] /api/order/create/
    create: async (req, res, next) => {
        try {
            await Cart.deleteMany({ user: req.body.user })
            const items = await req.body.items.map( (orderItem) => {
                let newOderItem = new OrderItem({
                    product: orderItem.pro_id,
                    quantity: orderItem.quantity
                })

                newOderItem.save();
                return newOderItem._id
            })
            
            req.body.items.map(async (orderItem) => {
                let prdupdate = await Product.findById(orderItem.pro_id)
                let quantity=prdupdate.quantity - orderItem.quantity
                let status=true
                if(quantity <= 0) {
                    status=false
                }
                await Product.updateOne({ _id: orderItem.pro_id }, {
                    quantity,status,
                    daBan: prdupdate.daBan + orderItem.quantity
                })
            })

            const arrTotalPrice = await Promise.all(items.map(async (orderItemId) => {
                const orderItem = await OrderItem.findById(orderItemId).populate("product")
                return (orderItem.product.price - (orderItem.product.price * orderItem.product.giamGia) / 100) * orderItem.quantity
            }))

            const totalPrice = arrTotalPrice.reduce((total, item) => total + item, 0)
            const { fullname, address, city, phone, user, notes, pay, email } = req.body
            const order = new Order({
                items,
                fullname,
                address,
                city,
                phone,
                email,
                notes,
                totalPrice,
                pay,
                user
            })

            await order.save()
            const orderitems = await OrderItem.find({_id:{$in:items}}).populate("product")
            const title = "CHÚC MỪNG BẠN ĐÃ ĐẶT HÀNG THÀNH CÔNG"
            const html = await ejs.renderFile(path.join(req.app.get("views"), "mail.ejs"), {...req.body,items:orderitems, formatter,totalPrice })
            sendMail(email, title, html)
            res.status(200).json({
                success: true,
                message: "success"
            })


        } catch {
            res.status(500).json({
                success: false,
                message: "Error"
            })

        }
    },
    //[PUT] /api/order/edit/:id (đổi trạng thái đơn hàng)
    putStatusOrder: (req, res, next) => {
        Order.updateOne({ _id: req.params.id }, { status: req.body.status })
            .then(() => res.status(200).json({
                success: true,
                message: "success"
            }))
            .catch(next)
    },
    //[DELETE] /api/order/delete/:id 
    deleteOrder: async (req, res, next) => {
        try {
            const order = await Order.findByIdAndDelete(req.params.id).populate("items", "_id")
            order.items.forEach(async (orderItem) => {
                await OrderItem.deleteOne(orderItem)
            })
            res.status(200).json({
                success: true,
                message: "success"
            })

        } catch {
            res.status(500).json({
                success: false,
                message: "Error"
            })
        }
    },


}

module.exports = OrderController