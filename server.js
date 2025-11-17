const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// public folder
app.use(express.static(path.join(__dirname, "public")));

// submit form route
app.post("/submit-form", async (req, res) => {
  const { name, phone, email, location } = req.body;

  // BREVO API EMAIL DATA
  const emailBody = {
    sender: { email: process.env.FROM_EMAIL },
    to: [{ email: process.env.TO_EMAIL }],
    subject: "New Client Application",
    textContent: `
A client has submitted a form:

Name: ${name}
Phone: ${phone}
Email: ${email}
Location: ${location}
    `,
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.log("Brevo Error:", errText);
      return res.status(500).json({ message: "Email failed" });
    }

    console.log("Email successfully sent via Brevo API!");

    // redirect to thank you page
    res.redirect(`/thankyou.html?name=${encodeURIComponent(name)}`);

  } catch (error) {
    console.log("API Error:", error);
    res.status(500).json({ message: "Email error" });
  }
});

// server listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
