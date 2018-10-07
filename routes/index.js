var express = require('express');
var router = express.Router();
var fs = require('fs');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'nodemailer9@gmail.com',
        pass: 'Yeah its me'
    },
    tls: {
        rejectUnauthorized: false
    }
});


/* GET */
router.get('/', function (req, res, next) {
    try {
        fs.readFile('github-webhook-response.json', function (err, buffer) {
            if (buffer && !err) {
                var data = JSON.parse(buffer);
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



/* POST */
router.post('/', function (req, res, next) {
    console.log('\n\n\n\n\n GITHUB POST REQUEST');
    console.log(req.body);

    // Get data from the file
    var data = JSON.stringify(req.body);
    fs.writeFileSync('github-webhook-response.json', data);

    // Send the email
    var mailOptions = {
        from: `Notification from ${repository.name} <foobar@gmail.com>`,
        to: 'eslam.nasser.dev@gmail.com',
        subject: `${repository.name}`,
        text: `${repository.full_name}`,
        html: `
            <div style='
                width: 50%;
                background-color: rgba(238, 238, 238, 0.3);
                margin: auto;
                position: relative;
                padding-bottom: 20px;
                box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);
				'>
				<h1 style='
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    margin: 0;
                    background: #3498db;
                    color: #FFF;
                    padding: 10px;
                    font-size: 15px;
                '> You have a new message!</h1>
				<ul>
					<li style='margin: 2px auto;'><b>Sender Name: </b> &nbsp; Repo Name: ${repository.full_name}</li>
					<li style='margin: 2px auto;'><b>Sender Email:</b> &nbsp; Commiter: 'Name'</li>
				</ul>
                <p style='
                    background: #FFF;
                    padding: 5px 10px;
                    border: 1px solid #EEE;
                    width: 85%;
                    margin: auto;
                '>
                    Commit Name
                </p>
			</div>
        `,
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
