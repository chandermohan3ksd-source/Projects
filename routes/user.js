const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utilis/wrapAsync.js");
const passport=require("passport");
const {saveUrl}=require("../middleware.js");
const controllerUser=require("../controller/user.js");

router.route("/singup")
//singup render form 
.get(controllerUser.singupRender)
//singup post form 
.post(controllerUser.singupPost);

router.route("/login")
//login router
.get(controllerUser.loginRenderForm)
//login form saved data
.post(saveUrl,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
    controllerUser.loginPost
);



// logout user
router.get("/logout",controllerUser.logout);
module.exports=router;