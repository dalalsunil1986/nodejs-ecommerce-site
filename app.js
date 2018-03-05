// EXPRESS
// ----------
const express = require('express');
const app = express();

// LOCAL VARIABLES
// ----------
app.locals.appName = "Mimir's Market";

// DOTENV
// ----------
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// BODY-PARSER
// ----------
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// COOKIE-SESSION
// ----------
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: "session", 
  keys: [process.env.SESSION_SECRET || 'secret1', 'secret2']
}));

app.use((req, res, next) => {
  console.log("setting res.locals");
  res.locals.session = req.session;
  res.locals.currentUser = req.session.currentUser;
  next();
});

// FLASH MESSAGES
// ----------
const flash = require('express-flash-messages');
app.use(flash());

// METHOD-OVERRIDE
// ----------
const methodOverride = require('method-override');
const getPostSupport = require('express-method-override-get-post-support');

app.use(methodOverride(
  getPostSupport.callback, 
  getPostSupport.options
));

// PUBLIC FOLDER
// ----------
app.use(express.static(`${__dirname}/public`));



// MORGAN - LOGGING
// ----------
const morgan = require('morgan');
const morganToolkit = require('morgan-toolkit')(morgan);

app.use(morganToolkit());


// MONGOOSE
// ----------
const mongoose = require('mongoose');
// const bluebird = require('bluebird');
// mongoose.promise = bluebird;
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require('./mongo')().then(() => next());
  }
});

// ROUTING
// ----------
app.get('/', (req, res) => {
  console.log("inside the home route");
  res.render('home');
});

app.get('/clearall', (req, res) => {
  req.session = {};
  res.render('home');
});

var productRoutes = require('./routes/product-routes');
app.use('/products', productRoutes);

var cartRoutes = require('./routes/cart-routes');
app.use('/cart', cartRoutes);

var adminRoutes = require('./routes/admin-routes');
app.use('/admin', adminRoutes);

// HANDLEBARS TEMPLATES
// ----------
const expressHandlebars = require('express-handlebars');
const helpers = require('./helpers');

const hbs = expressHandlebars.create({
  helpers: helpers,
  partialsDir: 'views/',
  defaultLayout: 'application', 
  
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// SERVER
// ----------

const port = process.env.PORT;
app.listen(port);

// ERROR HANDLING
// ----------
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.stack) {
    err = err.stack;
  }
  res.status(500).render('errors/500', { error: err });
});


module.exports = app;