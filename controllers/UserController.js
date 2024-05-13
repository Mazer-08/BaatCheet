const UserModel = require("../models/UserModel")
const generateToken = require("../config/GenerateToken")

module.exports.registerUser = async (req, res) => {
    const { name, username, email, password, pic } = req.body;
    try{
        // basic checks
        if(!name || !username || !email || !password ){
            res.status(400).json({errorMsg: "Incomplete Credentials"});
            // console.log("Incomplete Credentials");
            return;
        }
        const userExists = await UserModel.findOne({username});
        if(userExists){
            res.status(400).json({errorMsg: "User already exists"});
            // console.log("User already exists"); 
            return;    
        }

        // create user
        const user = await UserModel.create({
            name, username, email, password, pic, 
        });
        if(user){
            // console.log("User Created")
            res.status(201).json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                pic: user.pic,
            });
        }
        else{
            res.status(400).json({errorMsg: "User Not Created"});
        }
    }
    catch(error){
        res.status(400).send(`User Not Created. Error encountered: ${error.message}`);
    }
};

module.exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try{
        const user = await UserModel.findOne({username});
        if(user && (await user.matchPassword(password))){
            // console.log("User Logged In");
            res.status(200).json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id, user.username),
            });
        }
        else{
            // console.log("Login Failed. Invalid Credentials");
            res.status(400).json({errorMsg: "Invalid Credentials"});
        }
    }
    catch(error){
        // console.log("login failed. Error encountered: ", error.message);
        res.status(400).send(`Error encountered: ${error.message}`);
    }
}


// /api/user?search=keyword
module.exports.searchUsers = async (req, res) => {
    const keyword = req.query.search ? {
    // console.log(keyword);
        $or: [ {username: { $regex: req.query.search, $options: 'i' }}, 
               {name: { $regex: req.query.search, $options: 'i' }} ]
    } : {};

    try {
        const users = await UserModel.find(keyword).find({ _id: { $ne: req.user._id } });
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send(`Error encountered: ${error.message}`);
    }
}