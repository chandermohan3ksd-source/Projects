const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listiing.js");
const wrapAsync=require("../utilis/wrapAsync");
const {isLoggedIn,isOwner,validateListing,saveUrl}=require("../middleware.js");
const controllerListing=require("../controller/listing.js");
const multer=require("multer");
const {storage}=require("../cloudinary.js");
const upload=multer({storage});
router.route("")
//index route
.get(wrapAsync(controllerListing.index));
router.route("/")
// new list add router
.post(validateListing,upload.single("listing[image]"),wrapAsync(controllerListing.newListingPost));


// new route created
 router.get("/new",isLoggedIn,controllerListing.newListingRenderForm)


router.route("/:id")
//show route individual info
.get(wrapAsync(controllerListing.showIndividualListing))
// update route edit completed
.put(isLoggedIn,isOwner,upload.single("listing[image]"),wrapAsync(controllerListing.updatePostListing))
//delete route
 .delete(isLoggedIn,isOwner,wrapAsync(controllerListing.destroyListing));


// update router render form
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(controllerListing.updateListingRenderForm));
module.exports=router;

 
