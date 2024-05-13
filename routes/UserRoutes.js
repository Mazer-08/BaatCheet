const { Router } = require("express")
const { registerUser, loginUser, searchUsers } = require("../controllers/UserController"); 
const { protect } = require("../middleware/AuthMiddleware");

const router = Router()

router.route("/").get(protect, searchUsers).post(registerUser);
router.route("/login").post(loginUser);

// gives access to the route in Server.js
module.exports = router;