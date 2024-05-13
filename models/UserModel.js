const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema({
    name: {
        type: "String", 
        required: true,
    },
    username: {
        type: "String",
        required: true,
        unique: true,
    },
    email: { 
        type: "String", 
        unique: true, 
        required: true, 
    },
    password: { 
        type: "String", 
        required: true, 
    },
    pic: {
      type: "String",
      required: true,
      default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
},{timestamps: true});

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre("save", async function(next){
    if(!this.isModified){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


const UserModel = mongoose.model("UserModel", userSchema);
module.exports = UserModel;