var express = require('express');
var Authrouter = express.Router();

//Authentications all TABs.

Authrouter.get('/pages-comingsoon', function(req, res)
{
      res.render('Pages/pages-comingsoon');
});
Authrouter.get('/pages-lock-screen', function(req, res)
{
      res.render('Pages/pages-lock-screen');
});
Authrouter.get('/pages-lock-screen-2', function(req, res)
{
      res.render('Pages/pages-lock-screen-2');
});
Authrouter.get('/pages-login', function(req, res)
{
      res.render('Pages/pages-login');
});
Authrouter.get('/pages-login-2', function(req, res)
{
      res.render('Pages/pages-login-2');
});
Authrouter.get('/pages-maintenance', function(req, res)
{
      res.render('Pages/pages-maintenance');
});
Authrouter.get('/pages-recoverpw', function(req, res)
{
      res.render('Pages/pages-recoverpw');
});
Authrouter.get('/pages-recoverpw-2', function(req, res)
{
      res.render('Pages/pages-recoverpw-2');
});
Authrouter.get('/pages-register', function(req, res)
{
      res.render('Pages/pages-register');
});
Authrouter.get('/pages-register-2', function(req, res)
{
      res.render('Pages/pages-register-2');
});
Authrouter.get('/pages-coming-soon', function(req, res)
{
      res.render('Pages/pages-coming-soon');
});

module.exports = Authrouter;