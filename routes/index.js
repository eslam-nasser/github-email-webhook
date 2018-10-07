var express = require('express');
var router = express.Router();
var fs = require('fs');
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function (req, res, next) {
    try {
        fs.readFile('github-webhook-response.json', function (err, buffer) {
            if (err) throw err;
            var data = JSON.parse(buffer);
            // console.log('\n\n DATA FROM LOCAL FILE => ', data);
            return res.json({
                message: 'GitHub Data...',
                data: data
            });
        });
    } catch (error) {
        return res.json({
            message: 'No Github Data!',
            error: error
        });
    }
});

router.post('/', function (req, res, next) {
    console.log('\n\n\n\n\n GITHUB POST REQUEST');
    console.log(req.body);

    var data = JSON.stringify(req.body);
    fs.writeFileSync('github-webhook-response.json', data);

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'nodemailer9@gmail.com',
            pass: 'Yeah its me'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var mailOptions = {
        from: `${repository.name} <in1466@fayoum.com.eg>`,
        to: 'info@grintos.com',
        subject: `${repository.full_name} Github Notification`,
        text: 'You have a new notification!',
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
					<li style='margin: 2px auto;'><b>Sender Name: </b> &nbsp; ${req.body.name}</li>
					<li style='margin: 2px auto;'><b>Sender Email:</b> &nbsp; ${req.body.email}</li>
					<li style='margin: 2px auto;'><b>Sender Message is below:</li>
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
		`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('___Error: => ' + error);
            res.json({
                success: false,
                error: error
            });
        } else {
            console.log('Message Sent! ' + info.response);
            res.json({
                success: true,
                msg: info.response
            });
        }
    });

    return res.json({
        success: true
    });
});

module.exports = router;
