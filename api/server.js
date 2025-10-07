const express = require("express");
const routes = require("./Routes/routes");
const cors = require("cors");
const errorMiddleware = require("./Middlewares/errorMiddleware");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes

// Or enable for specific origins:
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
  })
);

// Middleware
app.use(express.json());

// API Routes
app.use("/api", routes);

// Error Handling Middleware
app.use(errorMiddleware);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
