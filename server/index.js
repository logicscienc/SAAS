require("dotenv").config();
console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);
const express = require("express");
const app = express();

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const tenantRoutes = require("./routes/tenantRoutes");

const seedRoutes = require("./routes/seedRoutes");


const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin:"http://localhost:3000",
		credentials:true,
	})
)

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/note", noteRoutes);
app.use("/api/v1/tenant", tenantRoutes);

app.use("/api/v1/seed", seedRoutes);



//def route

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

// health route
app.get("/health", (req, res) => {
  return res.json({ status: "ok" });
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
}) 


