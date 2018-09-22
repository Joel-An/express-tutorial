var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var fs = require("fs");

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log("Connected to mongodb server");
});

mongoose.connect('mongodb://localhost/mongodb_tutorial');
var Book = require('./models/book');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(3000, () => {
    console.log("Express server has started on  port 3000");
});

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: '@#@$MYSIGN#$%#%',
    resave: false,
    saveUninitialized: true
}));


var router = require('./router/main')(app, fs, Book);