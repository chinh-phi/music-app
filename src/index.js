var path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const passport = require('passport');
var session = require('express-session');
var methodOverride = require('method-override');
const MongoStore = require('connect-mongo');
const jsonServer = require('json-server');

const app = express();
const port = 3000;

const route = require('./routes');
const db = require('./config/db');

// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://Music:chinh123456@cluster0.jnadi.mongodb.net/Music?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


// require('dotenv').config();
require('./config/passport')(passport);
db.connect();

// static file
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({
  extended: true,
}));
app.use(express.json());

// HTTP logger
app.use(morgan('combined'));

// template engine
app.engine('hbs', handlebars({
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

app.set('trust proxy', 1);
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/F8_education_dev' })
}));

app.use(passport.initialize());
app.use(passport.session());

// app.use('/api', jsonServer.router('db.json'));

app.use(methodOverride('_method'));

// routes
route(app);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});