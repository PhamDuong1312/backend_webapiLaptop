const CommentBlog = require('../models/commentBlog')

const CommentBlogController = {

    //[GET] /api/comments
    index:async (req, res, next) => {

        const comment = await CommentBlog.find({content:{ $regex: req.search, $options:"i" }});
        const total=comment.length
        let pageCount = Math.ceil(total / req.pages.limit)
        if (req.pages.currentPage < pageCount) {
            req.pages.hasNext = true;
        }

        CommentBlog.find({content:{ $regex: req.search, $options:"i" }})
            .sort({createdAt: -1})
            .skip((req.pages.currentPage-1)*req.pages.limit)
            .limit(req.pages.limit)
            .populate("user").populate("blog")
            .then((comment) =>  res.json({
                data: comment,
                total,
                pages:req.pages
            }))
            .catch(next)
    },

    //[POST] /api/comments/create
    create: (req, res, next) => {
        const comment = new CommentBlog(req.body)
        comment.save()
            .then(() => res.json({
                status:true,
            }))
            .catch(()=>{
                res.json({
                    status:false,
                })
            })
    },

    //[DELETE] /api/comments/delete/:id
    delete: (req, res, next) => {
        CommentBlog.deleteOne({_id:req.params.id})
            .then(()=>{
                res.status(200).json({
                    status: true,
                })
            })
            .catch(next)
    },
    //[POST] /api/comments/deletemany
    deleteMany: (req, res, next) => {
        CommentBlog.deleteMany({_id:{$in:req.body.items}})
            .then(()=>{
                res.status(200).json({
                    status: true,
                })
            })
            .catch(next)
    },

    //[GET] /api/comments/product/:id
    getCmtBlog:async (req, res, next) => {
        const comment = await CommentBlog.find({blog:req.params.id});
        const total=comment.length
        
        let pageCount = Math.ceil(total / req.pages.limit)
        if (req.pages.currentPage < pageCount) {
            req.pages.hasNext = true;
        }
        CommentBlog.find({blog:req.params.id}).sort({createdAt: -1})
            .skip((req.pages.currentPage-1)*req.pages.limit).limit(req.pages.limit).populate("user")
            .then((comment)=>{
                res.json({
                    data: comment,
                    total,
                    pages:req.pages
                })
            })
            .catch(next)
    },

    


}

module.exports = CommentBlogController