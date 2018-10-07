var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
    try {
        fs.readFile('github-webhook-response.json', function (err, buffer) {
            if (err) throw err;
            var data = JSON.parse(buffer);
            console.log('\n\n DATA FROM LOCAL FILE => ', data);
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
    return res.json({
        success: true
    });
});

module.exports = router;
