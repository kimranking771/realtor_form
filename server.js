const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve public folder
app.use(express.static(path.join(__dirname, "public")));

transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: process.env.TO_EMAIL,
    subject: "New Client Application",
    text: `
A new client has submitted a form:

Name: ${name}
Phone: ${phone}
Email: ${email}
Location: ${location}
    `
}, (err, info) => {
    if (err) {
        console.log("Email error:", err);
    } else {
        console.log("Email sent:", info.response);
    }
});

// form handler
app.post("/submit-form", (req, res) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const location = req.body.location;

    // --------------------------
    // SEND EMAIL THROUGH BREVO
    // --------------------------
    transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: process.env.TO_EMAIL,
        subject: "New Client Application",
        text: `
A new client has submitted a form:

Name: ${name}
Phone: ${phone}
Email: ${email}
Location: ${location}

        `
    }, (err, info) => {
        if (err) {
            console.log("Email error:", err);
        } else {
            console.log("Email sent:", info.response);
        }
    });

    // Redirect to thank you page
    res.redirect(`/thankyou.html?name=${encodeURIComponent(name)}`);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
