var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
    var data = JSON.parse(fs.readFileSync('./github-webhook-response.json'));
    if (data) {
        return res.json({
            message: 'GitHub Data...',
            data: data
        });
    }
    return res.json({
        message: 'No Github Data!'
    });
});

router.post('/', function (req, res, next) {
    var data = JSON.stringify(req);
    fs.writeFileSync('github-webhook-response.json', data);
});

module.exports = router;
