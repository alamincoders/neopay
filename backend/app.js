const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");

connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("tiny"));

app.use("/api/auth", authRoutes);

// Define a route for the home page
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
        h1 { color: #333; }
      </style>
    </head>
    <body>
      <h1>Welcome to My Node.js App!</h1>
      <p>This is the first page of your application.</p>
    </body>
    </html>
  `);
});

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

module.exports = app;
