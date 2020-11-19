var express = require('express');
var router = express.Router();
var expressLayouts = require('express-ejs-layouts');

router.get('/pages-login', function(req, res)
{
      res.render('Pages/pages-login');
});
app.set('view engine', 'ejs');
app.use(expressLayouts);
