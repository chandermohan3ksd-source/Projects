const Listing=require("./models/listiing.js");
const ExpressError=require("./utilis/ExpreeError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/reviews.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
    req.flash("error","Please login first to continue!");
    return res.redirect("/login");
}else{
    next()
}
};
// redirect url save is locals
module.exports.saveUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next()
};

//check is ownwer is yes or not 
module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);

    }
    next();
};
//listing validate
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let newerr=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,newerr)
    }
    else{
        next();
    }
};

//Review validate
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let newerr=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,newerr);
    }else{
        next();
    }
};

//check author same to deleting author
module.exports.isReviewAuthor=async(req,res,next)=>{
    let{id,reviewid}=req.params;
    let review=await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Autohr of this Review");;
        return res.redirect(`/listings/${id}`);

    }
    next();
};

