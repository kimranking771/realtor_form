const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Required by Render so server doesn't show "Cannot GET /"
app.get("/", (req, res) => {
  res.send("Realtor Form API is running");
});

// SAVE FORM DATA HERE
app.post("/submit", (req, res) => {
  const formData = req.body;

  const dbFile = path.join(__dirname, "database.json");
  let savedData = [];

  if (fs.existsSync(dbFile)) {
    savedData = JSON.parse(fs.readFileSync(dbFile));
  }

  savedData.push({
    ...formData,
    submitted_at: new Date()
  });

  fs.writeFileSync(dbFile, JSON.stringify(savedData, null, 2));

  res.json({ success: true }); // Your Thank You page will still work
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
