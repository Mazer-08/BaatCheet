const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const protect = async (req, res, next) => {
    // console.log("in middleware");
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await UserModel.findById(decoded.id).select('-password');
            //console.log("Authorized");
            next();
        }
        catch(error){
            console.error(error);
            res.status(401).json({errorMsg: "Not Authorized, Token Failed"});
            console.log("Not Authorized");
        }
    }
    if(!token){
        res.status(401);
        res.json("Not authorized, no token");
    }
}

module.exports = { protect };