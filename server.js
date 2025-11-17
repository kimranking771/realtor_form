const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve public folder
app.use(express.static(path.join(__dirname, "public")));

// email transporter (Brevo SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// form handler
app.post("/submit-form", (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const location = req.body.location;

  // send email
  transporter.sendMail(
    {
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: "New Client Application",
      text: `
A client has submitted a form:

Name: ${name}
Phone: ${phone}
Email: ${email}
Location: ${location}
      `,
    },
    (err, info) => {
      if (err) {
        console.log("Email error:", err);
        return res.status(500).json({ message: "Email failed" });
      } else {
        console.log("Email sent:", info.response);
      }

      // redirect to thank you page
      res.redirect(`/thankyou.html?name=${encodeURIComponent(name)}`);
    }
  );
});

// server listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
