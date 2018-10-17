const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");
const router = express.Router();

router.get("/", (req, res) => {
  try {
    fs.readFile("github-webhook-response.json", function(err, buffer) {
      if (buffer && !err) {
        let data = JSON.parse(buffer);
        res.json({
          message: "GitHub Data...",
          data: data
        });
      } else {
        res.json({
          message: "No Github Data!"
        });
      }
    });
  } catch (error) {
    return res.json({
      message: "No Github Data!",
      error: error
    });
  }
});

router.post("/", (req, res) => {
  let data = JSON.stringify(req.body);
  fs.writeFileSync("github-webhook-response.json", data);

  const output = `
        <h3>Repository ${req.body.repository.name} Notification Detail</h3>
        <br>
        <ul>
        <li><strong>Repository ID:</strong> ${req.body.repository.id}</li>
        <br>
        <li><strong>Repository Name:</strong> ${req.body.repository.name}</li>
        <br>
        <li><strong>Repository Full Name:</strong> ${req.body.repository.full_name}</li>
        <br>
        <li><strong>Repository URL:</strong> ${req.body.repository.html_url}</li>
        <br>
        <li><strong>Commit id:</strong> ${req.body.commits[0].id}</li>
        <br>
        <li><strong>Commit Message:</strong> ${req.body.commits[0].message}</li>
        <br>
        <li><strong>Committed At:</strong> ${req.body.commits[0].timestamp}</li>
        <br>
        <li><strong>Commit URL:</strong> ${req.body.commits[0].url}</li>
        <br>
        <li><strong>Commit Differences:</strong> ${req.body.compare}</li>
        <br>
        <li><strong>Commit Author:</strong> ${req.body.commits[0].author.name}</li>
        <br>
        <li><strong>Commit Author E-mail:</strong> ${req.body.commits[0].author.email}</li>
        <br>
        <li><strong>Commit Author Username:</strong> ${req.body.commits[0].author.username}</li>
        </ul>`;

  let mailOptions = {
    from: `Notification from ${req.body.repository.name} <${process.env.USER}>`,
    to: process.env.USERTO,
    subject: req.body.repository.name,
    text: req.body.repository.name,
    html: output,
    bcc: process.env.USERTO
  };

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent: " + info.response);
      res.sendStatus(200);
    }
  });
  return res.json({ done: true });
});

module.exports = router;
