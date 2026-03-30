const Listing=require("../models/listiing");
//index roter con
module.exports.index=async(req,res)=>{
     let allListing= await Listing.find({});
    res.render("listing/index.ejs",{allListing});

};
module.exports.newListingRenderForm=(req,res)=>{
    res.render("listing/new.ejs")
};
   module.exports.newListingPost = async (req, res) => {
    let url=req.file.path;
    let fileName=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.image={url,fileName};
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings");
};
module.exports.showIndividualListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing You Requested For Does Not Exist !");

        return res.redirect("/listings")
    }
    res.render("listing/show.ejs",{listing})
};
module.exports.updateListingRenderForm=async(req,res)=>{
   let {id}=req.params;
   let listing= await Listing.findById(id);
   if(!listing){
    req.flash("error","Listing You Requested For Does Not Exist !");
    return res.redirect("/listings");
   }
   let originalUrl=listing.image.url;
   originalUrl=originalUrl.replace("/upload","/upload/c_fill,h_200,w_200");
    res.render("listing/edit.ejs",{listing,originalUrl});
};
module.exports.updatePostListing=async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing");
    }
    let {id}=req.params;
    
     let uplisting= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
     if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let fileName=req.file.filename; 
        uplisting.image={url,fileName};
        await uplisting.save();
     }
     req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
 }