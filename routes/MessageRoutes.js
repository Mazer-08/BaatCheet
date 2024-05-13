const express = require("express");
const { protect } = require("../middleware/AuthMiddleware");
const { allMessages, sendMessage } = require("../controllers/MessageController");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;
