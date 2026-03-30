if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}



const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utilis/ExpreeError.js");
const listingRouter=require("./routes/listings.js");
const reviewsRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore=require("connect-mongo").default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const multer=require("multer");
const upload=multer({dest:"uploads/"});
app.engine("ejs",ejsMate);
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname,"/public")))
app.use(express.urlencoded({extended:true}))
const dbUrl=process.env.ATLASDB_URL;
async function main(){
    await mongoose.connect(dbUrl);
};
main().then(()=>{console.log("connection successful");})
.catch((err)=>{console.log(err);});
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24*3600
});
store.on("error",(err)=>{
    console.log("Error in Mongo Session store",err);
})
const sessionOption={
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()*2*24*60*60*1000,
        maxAge:2*24*60*60*1000,
        httpOnly: true
    }
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});


app.use("/listings",listingRouter);
app.use("/listings/:id",reviewsRouter);
app.use("/",userRouter);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

 app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"));
 })
 app.use((err,req,res,next)=>{
    let{statusCode=500,message="something some wrong"}=err;
    res.render("error.ejs",{message});
 });
 app.listen(8080,()=>{
    console.log("server is listing on port number 8080");
});
