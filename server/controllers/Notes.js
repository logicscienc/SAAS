const Note = require("../models/Note");
const Tenant = require("../models/Tenant");
const User = require("../models/User");
const { response } = require("express");



exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const tenantId = req.user.tenantId;
    const userId = req.user.id;

    // 1. Validate input
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // 2. Validate user and tenant relationship
    const user = await User.findById(userId).populate("tenant");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    // Ensure this user actually belongs to this tenant
    if (user.tenant._id.toString() !== tenantId) {
      return res.status(403).json({
        success: false,
        message: "You do not belong to this tenant",
      });
    }

    // 3. Enforce free plan note limit directly from populated tenant
    if (user.tenant.plan === "free") {
      const noteCount = await Note.countDocuments({ tenant: tenantId });
      if (noteCount >= 3) {
        return res.status(403).json({
          success: false,
          message: "Free plan limit reached. Upgrade to Pro to add more notes.",
        });
      }
    }

    // 4. Create the note
    const note = await Note.create({
      title,
      content,
      tenant: tenantId,
      createdBy: userId,
    });

    return res.status(201).json({
      success: true,
      data: note,
      message: "Note created successfully",
    });
  } catch (error) {
    console.error("Error creating note:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Get All notes



exports.getNotes = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is missing from the request",
      });
    }

    // Fetch notes belonging to this tenant
    const notes = await Note.find({ tenant: tenantId })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    // Fetch tenant info
    const tenant = await Tenant.findById(tenantId).select("name plan slug");

    return res.status(200).json({
      success: true,
      count: notes.length,
      notes,
      tenant,   // <--- added tenant info
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching notes",
    });
  }
};




// get Note by id
exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user.tenantId;
    const userId = req.user.id;

    // 1. Validate user existence and tenant match
    const user = await User.findById(userId).populate("tenant");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    if (user.tenant._id.toString() !== tenantId) {
      return res.status(403).json({
        success: false,
        message: "You do not belong to this tenant",
      });
    }

    // 2. Fetch note within the tenant
    const note = await Note.findOne({ _id: id, tenant: tenantId });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found or you don't have access",
      });
    }

    return res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    console.error("Error fetching note:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




// Update Note
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const tenantId = req.user.tenantId;

    if (!title && !content) return res.status(400).json({ success: false, message: "At least one field (title or content) is required" });

    const note = await Note.findOne({ _id: id, tenant: tenantId });
    if (!note) return res.status(404).json({ success: false, message: "Note not found or you don't have access" });

    // Update fields
    if (title) note.title = title;
    if (content) note.content = content;

    await note.save();
    return res.status(200).json({ success: true, data: note, message: "Note updated successfully" });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};






// Delete Note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user.tenantId;

    const note = await Note.findOne({ _id: id, tenant: tenantId });
    if (!note) return res.status(404).json({ success: false, message: "Note not found or you don't have access" });

    await note.deleteOne();
    return res.status(200).json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

