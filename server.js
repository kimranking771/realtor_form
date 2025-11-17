const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve public folder
app.use(express.static(path.join(__dirname, "public")));

// Path to database file
const dbPath = path.join(__dirname, "database.json");

// Handle form submission
app.post("/submit-form", (req, res) => {
  const { name, phone, email, location } = req.body;

  // Read existing database
  fs.readFile(dbPath, "utf8", (err, data) => {
    let records = [];

    if (!err && data.trim() !== "") {
      records = JSON.parse(data);
    }

    // Add new form entry
    const newEntry = {
      name,
      phone,
      email,
      location,
      timestamp: new Date().toISOString()
    };

    records.push(newEntry);

    // Save back to database.json
    fs.writeFile(dbPath, JSON.stringify(records, null, 2), (err) => {
      if (err) {
        console.log("Write error:", err);
        return res.status(500).json({ message: "Failed to save data" });
      }

      // Redirect to thank you page
      res.redirect(`/thankyou.html?name=${encodeURIComponent(name)}`);
    });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
