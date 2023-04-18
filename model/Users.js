const Mongoose = require("mongoose");

let userSchema = Mongoose.Schema(
    {
        username: String,
    email: String,
    password: String,
    role:{
        type: String,
        default: "user"
    }     
    }
);

var userModel =Mongoose.model("User", userSchema);
module.exports={userModel};