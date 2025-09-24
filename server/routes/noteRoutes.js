const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
} = require("../controllers/Notes");

// Notes CRUD (all routes require authentication)
router.post("/", auth, createNote);
router.get("/", auth, getNotes);
router.get("/:id", auth, getNoteById);
router.put("/:id", auth, updateNote);
router.delete("/:id", auth, deleteNote);

module.exports = router;
