/******************* */
/****** start ****** */
/******************* */

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
var app  = express();
app.set('port', process.env.PORT || 3000);//3000번 포트 개방
app.use('/views2', static(path.join(__dirname, 'views2')));//--dirmane : js 파일이 있는 폴더경로
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


//**************************/
//***템플릿 디장인 적용 시점 */
//**************************/






/******************* */
/***** login ******* */
/******************* */
var login_state = "login";


/******************* */
/**** database ***** */
/******************* */
var Mongoose = require('mongoose');
const { stringify } = require("querystring");
var MongoClient = require('mongodb').MongoClient;

var database;
var UserSchema;
var UserModel;
function connectDB() {
	var databaseUrl = 'mongodb://localhost:27017/local';
	
	Mongoose.promise = global.promise;
	Mongoose.connect(databaseUrl, {useNewUrlParser: true,
        useUnifiedTopology: true}, function(err, db) {
        if (err) {
            console.log('데이터베이스 연결 시 에러 발생함.');
            return;
        }
	});
	
	database = Mongoose.connection;

	database.on('open', function() {
		console.log('데이터베이스에 연결됨 : ' + databaseUrl);
		

		UserSchema = Mongoose.Schema({
			id: String,
			name: String,
			password: String
		});
		console.log('UserSchma 정의함.');

		UserModel = Mongoose.model('users', UserSchema);
		console.log('Usermodel 정의함.');

	});

	database.on('disconnected', function() {
		console.log('데이터베이스 연결 끊어짐.')
	});

	database.on('error', console.error.bind(console, 'mongoose 연결 에러.'));

}


/*function connectDB() {
    var databaseUrl = 'mongodb://localhost:27017/local';

    MongoClient.connect(databaseUrl, {useNewUrlParser: true,
        useUnifiedTopology: true}, function(err, db) {
        if (err) {
            console.log('데이터베이스 연결 시 에러 발생함.');
            return;
        }	
        
        console.log('데이터베이스에 연결됨 : ' + databaseUrl);
        database = db;
        database = db.db('local');

    });	
}*/





// 여기부터 라우터
var router = express.Router();



// 로그인 라우팅 함수 - 로그인 후 세션 저장함
router.route('/process/login').post(function(req, res) {
	console.log('/process/login 라우팅 함수 호출됨.');

	var paramId = req.body.id || req.query.id;
	var paramPassword = req.body.password || req.query.password;
    console.log('요첨 파라미터 : ' + paramId + ', ' + paramPassword);



	
	if (req.session.user) {
		// 이미 로그인된 상태
		console.log('이미 로그인되어 상품 페이지로 이동합니다.');
		
		//res.redirect('/views/index.html');//로그인 되면 보여줄 화면..
	} else {
		if (database) {
			authUser(database, paramId, paramPassword, function(err, docs) {
				if (err) {throw err;}
				
				// 조회된 레코드가 있으면 성공 응답 전송
				if (docs) {
					console.dir(docs);
					req.session.user = {
						id: paramId,
						name: '소녀시대',
						authorized: true
					}
	
					// 조회 결과에서 사용자 이름 확인
					var username = docs[0].name;
					
					res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
					res.write('<h1>로그인 성공</h1>');
					res.write('<div><p>Param id : ' + paramId + '</p></div>');
					res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
					res.write("<br><br><a href='/process/product'>상품 페이지로 이동하기</a>");
					res.end();
				
				} else {  // 조회된 레코드가 없는 경우 실패 응답 전송
					res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
					res.write('<h1>로그인  실패</h1>');
					res.write('<div><p>아이디와 패스워드를 다시 확인하십시오.</p></div>');
					res.write("<br><br><a href='/views/pages-login.html'>다시 로그인하기</a>");
					res.end();
				}
			});
		} else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
			res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
			res.write('<h2>데이터베이스 연결 실패</h2>');
			res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
			res.end();
		}
		
		// 홈페이지창에 표시하는 기능 추후 수정
		// 수정 예정안
		// 서버 콘솔창에 표시 -> 접속자 ip, 식별자, 성공여부
	}
});




// 로그아웃 라우팅 함수 - 로그아웃 후 세션 삭제함
router.route('/process/logout').get(function(req, res) {

	console.log('/process/logout 호출됨.');
	
	if (req.session.user) {
		// 로그인된 상태
		console.log('로그아웃합니다.');
		
		req.session.destroy(function(err) {
			if (err) {throw err;}
			
			console.log('세션을 삭제하고 로그아웃되었습니다.');
			res.redirect('/views/index.html');
		});
	} else {
		// 로그인 안된 상태
		console.log('아직 로그인되어있지 않습니다.');
		
		res.redirect('/views/index.html');
	}
});

// 상품정보 라우팅 함수 //수정필수
router.route('/process/product').get(function(req, res) {
	console.log('/process/product 호출됨.');
	
	if (req.session.user) {
		res.redirect('/public/product.html');
	} else {
		res.redirect('/public/login2.html');
	}
});//로그인 상태일때 접속하게 해야됨!!



// 회원 가입 라우팅 함수
router.route('/process/newacc').get(function(req, res) {
	console.log('/process/newacc 호출됨.');
	
	if (req.session.user) {
		res.redirect('/public/product.html');
	}//로그인 상태 //추후 로그인 관련해서 알아보기
	else {
		res.redirect('./views/NewAccount.html');
	}//비로그인 상태

});//로그인 상태일때 접속하게 해야됨!!




// 회원추가 라우팅 함수
router.route('/process/adduser').post(function(req, res) {
	console.log('/process/adduser 라우팅 함수 호출됨.');
	
	var paramId = req.body.id || req.query.id;
	var paramPassword = req.body.password || req.query.password;
	var paramName = req.body.name || req.query.name;

	console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName);

	if(database) {
		addUser(database, paramId, paramPassword, paramName, 
		function(err, result) {
			if (err) {
				console.log('에러 발생.');
				res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
				res.write('<h1>에러 발생</h1>');
				res.end();
				return;
			}

			if (result) {
				console.dir(result);

				res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
				res.write('<h1>사용자 추가 성공</h1>');
				res.write('<div><p>사용자 : ' + paramName + '</p></div>');
				res.end();
			} else {
				console.log('에러 발생추가');
				res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
				res.write('<h1>사용자 추가 안됨.</h1>');
				res.end();

			}

		})
	} else {
		console.log('에러 발생추1가');
		res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
		res.write('<h1>데이터베이스 연결 안됨.</h1>');
		res.end();

	}
});


app.use('/',router);

var authUser = function (database, id, password, callback) {
	console.log('사람찾을때쓰는 authUser라는놈 호출됨. : ' + id + ', ' + password);
	
	UserModel.find({"id":id, "password":password}, function(err, docs)
	{
		if (err) {
			callback(err, null);
			return;
		}

		if (docs.length > 0) {
            console.log('로그인성공');
            callback(null, docs);
        } else {
            console.log('로그인실패.');
            callback(null, null);
        }

	});

    var users = database.collection('users');

    /*users.find({"id":id, "password":password}).toArray(function(err, docs)
    {
        if (err) {
            callback(err, null);
            return;
        }

        if (docs.length > 0) {
            console.log('로그인성공');
            callback(null, docs);
        } else {
            console.log('로그인실패.');
            callback(null, null);
        }

    });*/
};








//사람 추가하는 함수
var addUser = function(db, id, password, name, callback) {
	console.log('addUser 호출됨 : ' + id + ', ' + password + ', ' + name);

	var user = new UserModel({"id":id, "password":password, "name":name});

	user.save(function(err) {
		if(err){
			callback(err, null);
			return;
		}

		console.log('사용자 데이터 추가함.');
		callback(null, user);
	});

	/*var users = db.collection('users');

	//users.insertMany([{"id":id, "password":password, "name":name, "gender":gender, "userBirthday":userBirthday, "email_1":email_1, "email_2":email_2, "phone":phone, "address":address}], 
	
	users.insertMany([{"id":id, "password":password, "name":name}], 
		function(err, result) {
		if (err) {
			callback(err, null);
			return;
		}

		if(result.insertedCount > 0) {
			console.log('사용자 추가됨 : ' + result.insertedCount);
			callback(null, result);
		} else {
			console.log('추가된 레코드가 없음.');
			callback(null, null);
		}
	});*/

};



var errorHandler = expressErrorHandler({
	static: {
		'404':'./views/error/404.html'
	}
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);//오류


app.use(function (req, res, next) {
    console.log('첫 미들웨어 메인페이지 응답'+req.ip);
    res.writeHead(200,{"content-Type":'text/html;charset=utf8'});//200 정상응답  
	res.end('<h1>서버 정상 가동중</h1>');//서버가 오픈되어있다고 
	
    res.redirect('http://203.241.228.131:3000/views/index.html');//메인페이지로 가는것
	console.log(req);
    next();
});// 서버 정상가동 확인 및 접속자 ip 출력



/******************* */
/****create_server** */
/******************* */



http.createServer(app).listen(app.get('port'),ip, function () {

	console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));	
	connectDB();
	
}); 