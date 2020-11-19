var express = require("express");
var http = require('http'); // node 내장 모듈 불러옴 
var static = require('serve-static');// 특정 폴더의 파일들을특정 패스로 접근할 수 있도록 만들어주는 외장 모듈
var path = require('path');//경로

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var ip ="203.241.228.131";//서버주소
var errorHandler = require('errorhandler');
var expressErrorHandler =require('express-error-handler');
const expressSession = require('express-session');//세션

var MongoClient = require('mongodb').MongoClient;

var app = express();

app.set('port', process.env.PORT || 3000);//3000번 포트 개방
app.use('/views', static(path.join(__dirname, 'views')));//--dirmane : js 파일이 있는 폴더경로


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(expressSession({
	secret:'my key',
	resave:true,
    saveUninitialized:true
    //store:db 관련 저장소 운영
}));// 저장할 정보에 대해서 어떻게 할지..


var router = express.Router();

app.use('/',router);

// 등록되지 않는 패스에 대해 페이지 오류 응답
var errorHandler = expressErrorHandler({
	static: {
		'404':'./views/error/404.html'
	}
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);//오류

var server = http.createServer(app).listen(app.get('port'),ip, function () {

	console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
});