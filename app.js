var express = require('express'); //生成一个express 实例app
var path = require('path'); //
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var settings = require('./settings'); //添加数据库连接
var session = require('express-session'); //添加express-session 模块和
var MongoStore = require('connect-mongo')(session); //connect-mongo 模块实现了将会化信息存储到mongoldb中
var flash = require('connect-flash'); //引入flash 模块实现页面通知（即成功与错误信息的显示）功能。

var app = express();

// view engine setup
//设置 views 文件夹为存放视图文件的目录, 
//即存放模板文件的地方,__dirname 为全局变量,存储当前正在执行的脚本所在的目录
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');  // 设置视图模板引擎为ejs
app.use(flash()); //使用flash 功能

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev')); //加载日志中间件
app.use(bodyParser.json()); //加载解析json
app.use(bodyParser.urlencoded({ extended: false }));  //加载解析urlencode
app.use(cookieParser());  //加载解析cookie的中间件
app.use(express.static(path.join(__dirname, 'public')));  //设置静态文件目录为public

/*保存session 信息到mongodb 中*/
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//cookie 生存期为30 days
  store: new MongoStore({
    db: settings.db,
    host: settings.host,
    port: settings.port
  })
}));

//路由控制器
/* 第一种路由*/
// app.use('/', routes);
// app.use('/users', users);

/* 第二种路由，appjs 总路由，在此文件中实现路由控制*/
//app.<method>(path, [callback ...], callback)
//method 指http 请求方法, 如get 或 post; app.get(path, [middleware, ....], callback)
//path 指url 路径
// app.get('/', function(req, res){
//   res.send("server Root");
// });

// app.get('/login', function(req, res){
//   res.send("login page");
// });

/* 第三种种路由， 把所有的路由都放在index.js 中*/
routes(app);
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
