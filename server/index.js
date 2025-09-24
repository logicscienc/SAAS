require("dotenv").config();
console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);

const express = require("express");
const serverless = require("serverless-http"); 
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const seedRoutes = require("./routes/seedRoutes");

const database = require("./config/database");
const app = express();

// Database connect
database.connect();

// Middlewares
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:3000", // dev frontend
  "https://saas-frontend-git-main-anju-kumaris-projects-d57c2c52.vercel.app" // hosted frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);


// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/note", noteRoutes);
app.use("/api/v1/tenant", tenantRoutes);
app.use("/api/v1/seed", seedRoutes);

// Default route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

// Health route
app.get("/api/v1/health", (req, res) => {
  return res.json({ status: "ok" });
});



// Export for Vercel serverless
module.exports = app;
module.exports.handler = serverless(app);


