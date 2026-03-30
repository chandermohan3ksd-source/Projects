const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utilis/wrapAsync");
const ExpressError=require("../utilis/ExpreeError.js");
const Review=require("../models/reviews.js");
const Listing=require("../models/listiing.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const controllerReview=require("../controller/reviews.js");
const {saveUrl}=require("../middleware.js");

//Reviews post requst
 router.post("/review",saveUrl,isLoggedIn,validateReview,wrapAsync(controllerReview.createReview));

//  delele reviews route
router.delete("/review/:reviewid",saveUrl,isLoggedIn,isReviewAuthor,wrapAsync(controllerReview.destrouReview));
module.exports=router;