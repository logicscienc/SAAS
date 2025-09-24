const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const { upgradeTenant, getTenant } = require("../controllers/Tenant");

const Tenant = require("../models/Tenant");

// --- TEMPORARY SEED ROUTE ---
// This route does NOT use auth, so you can hit it directly
router.get("/seed-tenants", async (req, res) => {
  try {
    const acme = await Tenant.create({ name: "Acme", slug: "acme", plan: "free" });
    const globex = await Tenant.create({ name: "Globex", slug: "globex", plan: "free" });

    res.json({ success: true, tenants: [acme, globex] });
  } catch (err) {
    console.error("Tenant seed error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});
// Get tenant info (authenticated)
router.get("/:slug", auth, getTenant);

// Upgrade tenant plan (Admin only)
router.post("/:slug/upgrade", auth, upgradeTenant);

module.exports = router;
