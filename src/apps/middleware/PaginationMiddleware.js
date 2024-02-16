
const PaginationMiddleware = (req,res,next) =>{
    const search=req.query.keyword||""
    const filter=req.query.filter||""
    req.sort={
        type:req.query.type||"desc",
        field:req.query.field||"name"
    }
    
    const pages = {
        currentPage: 1,
        prev: 0,
        next: 2,
        hasNext: false,
        hasPrev: false,
        limit: 9
    }
    if (req.query.limit) {
        pages.limit = parseInt(req.query.limit)
    }
    if (req.query.page) {
        pages.currentPage = parseInt(req.query.page)
    }
    pages.prev = pages.currentPage - 1;
    pages.next = pages.currentPage + 1;
    if (pages.currentPage > 1) {
        pages.hasPrev = true;
    }
    req.search=search;
    req.filter=filter;
    req.pages=pages;
    next();
}

module.exports=PaginationMiddleware