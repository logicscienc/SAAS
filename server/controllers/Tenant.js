const Tenant = require("../models/Tenant");
const User = require("../models/User");



// Get tenant info by slug
exports.getTenant = async (req, res) => {
  try {
    const { slug } = req.params;

    const tenant = await Tenant.findOne({ slug });
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: tenant,
    });
  } catch (error) {
    console.error("Error fetching tenant:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Upgrade tenant plan (Free → Pro) - Admin only
exports.upgradeTenant = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user.id;

    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is admin
    if (user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Only Admin can upgrade the plan",
      });
    }

    // Find tenant
    const tenant = await Tenant.findOne({ slug });
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    // Upgrade plan
    tenant.plan = "pro";
    await tenant.save();

    return res.status(200).json({
      success: true,
      message: "Tenant upgraded to Pro successfully",
      data: tenant,
    });
  } catch (error) {
    console.error("Error upgrading tenant:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};