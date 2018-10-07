var express = require('express');
var router = express.Router();
var fs = require('fs');
var nodemailer = require('nodemailer');

/* GET */
router.get('/', function (req, res, next) {
    try {
        fs.readFile('github-webhook-response.json', function (err, buffer) {
            if (buffer && !err) {
                var data = JSON.parse(buffer);
                // console.log('\n\n DATA FROM LOCAL FILE => ', data);
                res.json({
                    message: 'GitHub Data...',
                    data: data
                });
            } else {
                res.json({
                    message: 'No Github Data!'
                });
            }
        });
    } catch (error) {
        return res.json({
            message: 'No Github Data!',
            error: error
        });
    }
});





var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'nodemailer9@gmail.com', // Your email id
        pass: 'Yeah its me' // Your password
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});

/* POST */
router.post('/', function (req, res, next) {
    // console.log('\n\n\n\n\n GITHUB POST REQUEST');
    console.log(req.body);

    var data = JSON.stringify(req.body);
    fs.writeFileSync('github-webhook-response.json', data);


    var mailOptions = {
        from: 'Foo Bar ✔ <foobar@gmail.com>',
        to: 'eslam.nasser.dev@gmail.com',
        subject: "Hello " + 'eslam.nasser.dev@gmail.com',
        text: 'Hello ' + 'eslam.nasser.dev@gmail.com' + '✔',
        html: "<p>Hello " + 'eslam.nasser.dev@gmail.com' + " </p>",
        bcc: "eslam.nasser.dev@gmail.com"
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
            res.send(200);
        }
    });


    return res.json({ done: true });
});

module.exports = router;
