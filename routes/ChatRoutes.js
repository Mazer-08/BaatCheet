const express = require("express");
const { protect } = require("../middleware/AuthMiddleware");
const { createChat, fetchChats, fetchGroupChats, createGroupChat, renameGroup, addToGroup, removeFromGroup, deleteChat } = require("../controllers/ChatControllers");

const router = express.Router();

router.route("/").post(protect, createChat).get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat).get(protect, fetchGroupChats);
router.route("/rename").put(protect, renameGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/delete").delete(protect, deleteChat);

module.exports = router;
