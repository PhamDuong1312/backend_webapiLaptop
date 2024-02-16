const Blog = require('../models/blog')
const CommentBlog = require('../models/commentBlog')

const config = require('config')
const fs = require('fs')
const path = require('path')



const BlogController = {

    //[GET] /api/blogs
    index: async (req, res, next) => {
        const blog = await Blog.find({title:{ $regex: req.search, $options:"i" }});
        const total = blog.length
        let pageCount = Math.ceil(total / req.pages.limit)
        if (req.pages.currentPage < pageCount) {
            req.pages.hasNext = true;
        }
        Blog.find({title:{ $regex: req.search, $options:"i" }})
            .sort({createdAt: -1})
            .skip((req.pages.currentPage - 1) * req.pages.limit)
            .limit(req.pages.limit)
            .then((blog) => res.json({
                data: blog,
                total,
                pages: req.pages
            }))
            .catch(next)
    },

    //[POST] /api/blogs/create
    create: (req, res, next) => {
        const blog = new Blog({ ...req.body, image: req.file.originalname })
        blog.save()
            .then(() => res.status(200).json({
                success: true,
                message: 'success'
            }))
            .catch(err => res.status(500).json({
                success: false,
                message: 'failed'
            }))
    },

    //[GET] /api/blogs/:id
    getDetail: (req, res, next) => {
        Blog.findById(req.params.id)
            .then((blog) => res.status(200).json({
                status: 'success',
                data: blog
            }))
            .catch(err => res.status(500).json({
                status: 'failed',
                data: {}
            }))
    },
    //[PUT] /api/blogs/edit/:id
    edit: async (req, res, next) => {
        if (req.file) {
            const blog = await Blog.findById(req.params.id);
            const imagePath = config.app.static_folder + "/images/blogs/" + blog.image
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath)
            }
            Blog.updateOne({ _id: req.params.id }, { ...req.body, image: req.file.originalname })
                .then(() => res.status(200).json({
                    status: 'success',
                }))
                .catch(err => res.status(500).json({
                    status: 'failed',
                }))
        } else {
            Blog.updateOne({ _id: req.params.id }, req.body)
                .then(() => res.status(200).json({
                    status: 'success',
                }))
                .catch(err => res.status(500).json({
                    status: 'failed',
                }))
        }


    },
    //[DELETE] /api/blogs/delete/:id
    delete: async (req, res, next) => {
        const blog = await Blog.findById(req.params.id)
        const imagePath = config.app.static_folder + "/images/blogs/" + blog.image
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
        }
        await CommentBlog.deleteMany({blog:req.params.id})
        Blog.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({
                status: 'success',
            }))
            .catch(err => res.status(500).json({
                status: 'failed',
            }))
    },
    //[POST] /api/blogs/deletemany
    deleteMany: async (req, res, next) => {
        const blog = await Blog.find({_id:{$in:req.body.items}})
        blog.forEach((item) => {
            const imagePath = config.app.static_folder + "/images/blogs/" + item.image
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath)
            }
        })
        await CommentBlog.deleteMany({blog:{$in:req.body.items}})
        Blog.deleteMany({ _id: {$in:req.body.items} })
            .then(() => res.status(200).json({
                status: 'success',
            }))
            .catch(err => res.status(500).json({
                status: 'failed',
            }))
    },


}

module.exports = BlogController;