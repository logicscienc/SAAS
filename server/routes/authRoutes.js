// import the required modules
const express = require("express");
const router = express.Router();

const {login} = require("../controllers/Auth")


const {auth} = require("../middlewares/auth");

// Route for user login
router.post("/login", login)

module.exports = router