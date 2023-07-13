require("dotenv").config();
const mongoose = require("mongoose")

const username = process.env.ATLAS_USERNAME
const password = process.env.ATLAS_PASSWORD

const url = `mongodb+srv://${username}:${password}@cluster0.wxuoeen.mongodb.net/session`
// const url = "mongodb://localhost/taskDB"
mongoose.connect(url).then( ()=>{
    console.log("Database connected Successfully!.... ");
}).catch((error)=>{
    console.log(error.message);
})