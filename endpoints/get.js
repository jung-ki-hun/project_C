const express = require('express');
const session = require("express-session");
var router = express.Router();

router.get('/account', function (req, res, next) {
    if(!req.session.user) {
        res.statusCode = 403;
        res.json({
            error: 'not logged in'
        });
    }
    else {
        res.json(req.session.user);
    }
});

module.exports = router;