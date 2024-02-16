const productRouter =require('./product')
const categoryRouter =require('./category')
const userRouter =require('./user')
const authRouter =require('./auth')
const commentRouter =require('./comment')
const cartRouter =require('./cart')
const orderRouter =require('./order')
const bankingRouter =require('./banking')
const contactRouter =require('./contact')
const blogRouter =require('./blog')
const commentBlogRouter =require('./commentBlog')






const  routes=(app)=> {
    app.use("/api/products",productRouter)
    
    app.use("/api/categories",categoryRouter)

    app.use("/api/users",userRouter)

    app.use("/api/comments",commentRouter)

    app.use("/api",authRouter)
    
    app.use("/api/cart",cartRouter)

    app.use("/api/order",orderRouter)

    app.use('/api/bank',bankingRouter)

    app.use('/api/contact',contactRouter)

    app.use('/api/blogs',blogRouter)

    app.use("/api/commentsblog",commentBlogRouter)


}






module.exports =routes;