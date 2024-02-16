const Comment = require('../models/comment')

const CommentController = {

    //[GET] /api/comments
    index:async (req, res, next) => {

        const comment = await Comment.find({content:{ $regex: req.search, $options:"i" }});
        const total=comment.length
        let pageCount = Math.ceil(total / req.pages.limit)
        if (req.pages.currentPage < pageCount) {
            req.pages.hasNext = true;
        }

        Comment.find({content:{ $regex: req.search, $options:"i" }})
            .sort({createdAt: -1})
            .skip((req.pages.currentPage-1)*req.pages.limit)
            .limit(req.pages.limit)
            .populate("user").populate("product")
            .then((comment) =>  res.json({
                data: comment,
                total,
                pages:req.pages
            }))
            .catch(next)
    },

    //[POST] /api/comments/create
    create: (req, res, next) => {
        const comment = new Comment(req.body)
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
        Comment.deleteOne({_id:req.params.id})
            .then(()=>{
                res.status(200).json({
                    status: true,
                })
            })
            .catch(next)
    },
    //[POST] /api/comments/deletemany
    deleteMany: (req, res, next) => {
        Comment.deleteMany({_id:{$in:req.body.items}})
            .then(()=>{
                res.status(200).json({
                    status: true,
                })
            })
            .catch(next)
    },

    //[GET] /api/comments/product/:id
    getCmtPro:async (req, res, next) => {
        const comment = await Comment.find({product:req.params.id});
        const total=comment.length
        
        let pageCount = Math.ceil(total / req.pages.limit)
        if (req.pages.currentPage < pageCount) {
            req.pages.hasNext = true;
        }
        Comment.find({product:req.params.id}).sort({createdAt: -1}).skip((req.pages.currentPage-1)*req.pages.limit).limit(req.pages.limit).populate("user")
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

module.exports = CommentController