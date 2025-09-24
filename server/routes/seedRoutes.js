const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Tenant = require("../models/Tenant");

// --- TEMPORARY USERS SEED ROUTE ---
router.get("/seed-users", async (req, res) => {
  try {
    // Find tenants first
    const acme = await Tenant.findOne({ slug: "acme" });
    const globex = await Tenant.findOne({ slug: "globex" });

    if (!acme || !globex) {
      return res.status(400).json({
        success: false,
        message: "Tenants not found. Seed tenants first.",
      });
    }

    // Define users data
    const usersData = [
      { name: "Admin Acme", email: "admin@acme.test", password: "password", role: "Admin", tenant: acme._id },
      { name: "User Acme", email: "user@acme.test", password: "password", role: "Member", tenant: acme._id },
      { name: "Admin Globex", email: "admin@globex.test", password: "password", role: "Admin", tenant: globex._id },
      { name: "User Globex", email: "user@globex.test", password: "password", role: "Member", tenant: globex._id },
    ];

    // Hash passwords
    for (let u of usersData) {
      const existingUser = await User.findOne({ email: u.email });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await User.create({ ...u, password: hashedPassword });
      }
    }

    res.json({ success: true, message: "Users seeded successfully" });
  } catch (err) {
    console.error("User seed error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
