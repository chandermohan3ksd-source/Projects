const mongoose=require("mongoose");
const data=require("./data.js");
const Listing=require("../models/listiing.js");
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};
main().then(()=>{console.log("connection successful");})
.catch((err)=>{console.log(err);});
async function inset(){
   await Listing.deleteMany({});
    data.data=data.data.map((obj)=>({
        ...obj,owner:"69a4fb7dd02533a7b0294728"
    }));
   await Listing.insertMany(data.data);
};
inset()
.then(()=>{
    console.log("data saved");
})
.catch((err)=>{
    console.log(err);
});
