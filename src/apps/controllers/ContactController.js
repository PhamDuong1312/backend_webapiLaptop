const Contact = require('../models/contact')
const sendMail = require('../../ultils/index')
const ContactController = {

    //[GET] /api/contact
    index: async (req, res, next) => {
        const filter=[]
        if(req.filter==="admin"){
            filter.push(true)
        }else if(req.filter==="member"){
            filter.push(false)
        }else{
            filter.push(true,false)
        }
        const contact = await Contact.find({fullname:{ $regex: req.search, $options:"i" },status:{$in:filter}});
        const total = contact.length

        let pageCount = Math.ceil(total / req.pages.limit)
        if (req.pages.currentPage < pageCount) {
            req.pages.hasNext = true;
        }
        Contact.find({fullname:{ $regex: req.search, $options:"i" },status:{$in:filter}})
            .sort({ createdAt: -1 })
            .skip((req.pages.currentPage - 1) * req.pages.limit).limit(req.pages.limit)
            .then((contact) => res.json({
                data: contact,
                total,
                pages: req.pages
            }))
            .catch(next)
    },
    //[GET] /api/contact/:id/
    getDetail: (req, res, next) => {
        Contact.findById(req.params.id)
            .then((contact) => res.status(200).json({
                status: 'success',
                data: contact
            }))
            .catch(err => res.status(500).json({
                status: 'failed',
                data: {}
            }))
    },
    //[POST] /api/contact/create/
    create: async (req, res, next) => {
        const contact = new Contact(req.body)
        contact.save()
            .then(() => res.status(200).json({
                success: true,
                message: 'success'
            }))
            .catch(err => res.status(500).json({
                success: false,
                message: 'failed'
            }))
    },
    //[PUT] /api/contact/reply/:id
    reply: async (req, res, next) => {
        try {
            const contact=await Contact.findByIdAndUpdate({ _id: req.params.id },{status:req.body.status})
            sendMail(contact.email,req.body.title,req.body.message)
            res.status(200).json({
                status: 'success',
            })
        } catch {
            res.status(500).json({
                status: 'failed',
            })
        }
    },
    //[DELETE] /api/contact/delete/:id 
    delete: async (req, res, next) => {
        try {
            await Contact.deleteOne({ _id: req.params.id })
            res.status(200).json({ status: true })

        } catch {
            res.status(500).json({ status: false })

        }
    },
     //[POST] /api/contact/deletemany
    deleteMany: async (req, res, next) => {
        try {
            await Contact.deleteMany({ _id:{$in:req.body.items}})
            res.status(200).json({ status: true })

        } catch {
            res.status(500).json({ status: false })

        }
    },



}

module.exports = ContactController