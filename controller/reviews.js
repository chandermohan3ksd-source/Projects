const Review=require("../models/reviews.js");
const Listing=require("../models/listiing.js");


module.exports.createReview=async(req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Created!");
    res.redirect(`/listings/${listing._id}`);
 }

 module.exports.destrouReview=async(req,res)=>{
     let{id,reviewid}=req.params;
     await Review.findByIdAndDelete(reviewid);
     await Listing.findByIdAndUpdate(id,{$pull:{review:reviewid}});
     req.flash("success","Review Deleted!");
     const redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
 }