const Order = require('../models/order');
const OrderItem = require('../models/orderItem')
const Cart = require('../models/cart')
const sendMail = require('../../ultils/index');
const moment = require('moment');


const OrderController = {

    //[GET] /api/order
    index: async (req, res, next) => {
        const status = req.filter || "";
        const order = await Order.find({fullname:{ $regex: req.search, $options:"i" }, status: { $regex: status, $options: "i" } });
        const total = order.length
        let pageCount = Math.ceil(total / req.pages.limit)
        if (req.pages.currentPage < pageCount) {
            req.pages.hasNext = true;
        }
        Order.find({fullname:{ $regex: req.search, $options:"i" }, status: { $regex: status, $options: "i" } })
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
        const start=new Date(req.query.start)
        const end=new Date(req.query.end)
        Order.find({dateOrder:{$lte:end,$gte:start},status:"done"}).populate({ path: "items", populate: "product" }).populate("user", "fullName")
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
            const items = await req.body.items.map(orderItem => {
                let newOderItem = new OrderItem({
                    product: orderItem.pro_id,
                    quantity: orderItem.quantity
                })
                newOderItem.save();
                return newOderItem._id
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
            const title = "CHÚC MỪNG BẠN ĐÃ ĐẶT HÀNG THÀNH CÔNG"
            const html = `
                    <h1>Đơn hàng của bạn<h1>
                    <table border="1">
                        <tr>
                            <th>STT</th>
                            <th>Sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                        </tr>
                        ${await Promise.all(items.map(async(item, i) => {
                            const orderitem= await OrderItem.findById(item).populate("product")
                                return (`
                                <tr>
                                <td>${i+1}</td>
                                <td>${orderitem.product.name}</td>
                                <td>${orderitem.quantity}</td>
                                <td>${orderitem.product.price}</td>
                                </tr>
                                `
                                )
                            }))}
                        
                    </table>
                    <div style='
                        border:1px solid #ccc;
                        border-radius: 10px; padding:0 10px
                    ' className="infor_order">
                        <div style='border-bottom: 1px solid #ccc'>
                            <p style=' margin: 0; display: inline-block; padding: 20px 0; width: 140px;'>Tên khách hàng
                            </p>
                            <span >${fullname}</span>
                        </div>
                        <div style=' borderBottom: 1px solid #ccc'>
                            <p style=' margin: 0; display: inline-block; padding: 20px 0; width: 140px'>Địa chỉ</p>
                            <span >${address}</span>
                        </div>
                        <div style="borderBottom: 1px solid #ccc">
                            <p style="margin: 0; display: inline-block; padding:20px 0; width: 140px">Số điện thoại</p>
                            <span >${phone}</span>
                        </div>
                        <div style="border-bottom: 1px solid #ccc">
                            <p style="margin: 0; display: inline-block; padding: 20px 0; width: 140px">Email</p>
                            <span >${email}</span>
                        </div>
                        <div style="border-bottom: 1px solid #ccc">
                            <p style="margin: 0; display: inline-block; padding: 20px 0; width: 140px">Ghi chú</p>
                            <span>${order.notes}</span>
                        </div>
                        <div>
                            <p style="margin: 0; display: inline-block; padding: 20px 0; width: 140px">Phương thức</p>
                            <span >${pay === "cod" ? "Thanh toán khi nhận hàng" : "Thanh toán chuyển khoản VNPAY"}</span>
                        </div>
                        <p>Tổng tiền :${totalPrice} </p>
            `

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