const Category = require('../models/category')

const CategoryController = {

    //[GET] /api/categories
    index:async (req, res, next) => {
        const category = await Category.find({name:{ $regex: req.search, $options:"i" }});
        const total=category.length
     
        let pageCount = Math.ceil(total / req.pages.limit)
        if (req.pages.currentPage < pageCount) {
            req.pages.hasNext = true;
        }

        Category.find({name:{ $regex: req.search, $options:"i" }})
            .skip((req.pages.currentPage-1)*req.pages.limit).limit(req.pages.limit)
            .then((category) =>  res.json({
                data: category,
                total,
                pages:req.pages
            }))
            .catch(next)
    },

    //[POST] /api/categories/create
    create: async (req, res, next) => {
        const findCategory = await Category.findOne({ name: req.body.name })
        if (!findCategory) {
            const category = new Category(req.body)
             category.save()
                .then(() => res.status(200).json({
                    success: true,
                    message: 'success'
                }))
                .catch(err => res.status(500).json({
                    success: false,
                    message: 'failed'
                }))
        } else {
            res.status(500).json({
                success: false,
                message: 'đã có'
            })
        }
    },
    //[GET] /api/categories/:id
    getDetail: (req, res, next) => {
        Category.findById(req.params.id)
            .then((category) => res.status(200).json({
                status: 'success',
                data: category
            }))
            .catch(err => res.status(500).json({
                status: 'failed',
                data: {}
            }))
    },
    //[PUT] /api/categories/edit/:id
    edit: async (req, res, next) => {
        const findCategory = await Category.findOne({ name: req.body.name })
        if (!findCategory) {

           await Category.updateOne({ _id: req.params.id }, req.body)
                .then(() => res.status(200).json({
                    status: 'success',
                }))
                .catch(err => res.status(500).json({
                    status: 'failed',
                }))
        }else{
            res.status(500).json({
                status: 'failed',
            })
        }
    },
    //[DELETE] /api/categories/delete/:id
    delete: (req, res, next) => {
        Category.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({
                status: 'success',
            }))
            .catch(err => res.status(500).json({
                status: 'failed',
            }))
    },
    //[POST] /api/categories/deletemany
    deleteMany: (req, res, next) => {
        Category.deleteMany({ _id: {$in:req.body.items} })
            .then(() => res.status(200).json({
                status: 'success',
            }))
            .catch(err => res.status(500).json({
                status: 'failed',
            }))
    }
}

module.exports = CategoryController