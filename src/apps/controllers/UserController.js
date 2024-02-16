const User = require('../models/user')
const Comment = require('../models/comment')
const Cart = require('../models/cart')
const CommentBlog = require('../models/commentBlog')



const UserController = {

    //[GET] /api/users
    index: async (req, res, next) => {
        const filter=[]
        if(req.filter==="admin"){
            filter.push(true)
        }else if(req.filter==="member"){
            filter.push(false)
        }else{
            filter.push(true,false)
        }
        const user = await User.find({fullName:{ $regex: req.search, $options:"i" },isAdmin:{$in:filter}});
        const total=user.length
        let pageCount = Math.ceil(total / req.pages.limit)
        if (req.pages.currentPage < pageCount) {
            req.pages.hasNext = true;
        }
        User.find({fullName:{ $regex: req.search, $options:"i" },isAdmin:{$in:filter}})
            .skip((req.pages.currentPage-1)*req.pages.limit)
            .limit(req.pages.limit)
            .then((user) => res.json({
                data: user,
                total,
                pages:req.pages
            }))
            .catch(next)
    },

    //[POST] /api/users/create
    create: async (req, res, next) => {
        const findUser = await User.findOne({ email: req.body.email })
        if (!findUser) {

            const user = new User(req.body)
            user.save()
                .then(() => res.status(200).json({
                    success: true,
                    user:user,
                    message: 'success'
                }))
                .catch(err => res.status(500).json({
                    success: false,
                    message: 'dữ liệu không hợp lệ'
                }))
        } else {
            res.status(500).json({
                success: false,
                message: "đã tồn tại"
            })
        }
    },
    //[GET] /api/users/:id
    getDetail: (req, res, next) => {
        User.findById(req.params.id)
            .then((user) => res.status(200).json({
                status: 'success',
                data: user
            }))
            .catch(err => res.status(500).json({
                status: 'failed',
                data: {}
            }))
    },
    //[PUT] /api/users/edit/:id
    edit: (req, res, next) => {
        User.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.status(200).json({
                status: 'success',
            }))
            .catch(err => res.status(500).json({
                status: 'failed',
            }))
    },
    //[DELETE] /api/users/delete/:id
    delete: async (req, res, next) => {
        await Cart.deleteMany({ user: req.params.id })
        await Comment.deleteMany({ user: req.params.id })
        await CommentBlog.deleteMany({ user: req.params.id })

        await User.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({
                status: 'success',
            }))
            .catch(err => res.status(500).json({
                status: 'failed',
            }))
    },
    //[POST] /api/users/deletemany
    deleteMany: async (req, res, next) => {
        await Cart.deleteMany({ user: {$in:req.body.items} })
        await Comment.deleteMany({  user: {$in:req.body.items}})
        await CommentBlog.deleteMany({  user: {$in:req.body.items}})

        await User.deleteMany({ _id: {$in:req.body.items} })
            .then(() => res.status(200).json({
                status: 'success',
            }))
            .catch(err => res.status(500).json({
                status: 'failed',
            }))
    }
}

module.exports = UserController