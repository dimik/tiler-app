var express = require('express'),
    HTTPClient = require('handy-http'),
    client = new HTTPClient(),
    UsersModel = require('./mongo-models/users'),
    MongoConnector = require('./lib/mongo-connector'),
    UsersModel = require('./mongo-models/users'),
    YaDiskProxy = require('./lib/ya-disk-proxy'),
    TilerRouter = require('./lib/tiler-router');

var con = new MongoConnector('127.0.0.1', 27017);
var app = express();
var proxy = new YaDiskProxy();

proxy.listen(8002);

app.use(express.cookieParser());
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(process.cwd() + '/public/js'));
// app.set("view options", { layout: false });
// app.use(express.static(__dirname + '/public'));

con.use('tiler')
    .then(function (db) {
        return db.getCollection('users');
    })
    .then(function (collection) {
        var users = new UsersModel(collection),
            router = new TilerRouter(users);

        app.get('/', router.root.bind(router));
        app.get('/auth', router.auth.bind(router));
        app.get('/login', router.login.bind(router));
        app.listen(3000);
    });
