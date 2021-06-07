const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

require('./config/passport')(passport);

app.use(express.static('public'));

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=> console.log('MongoDB connected'));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({extended: false}));
app.use(fileUpload());

// Express Session
app.use(session({ secret: 'sixon the goat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Flash Variables
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.loginError = req.flash('loginError');
    res.locals.loginSuccess = req.flash('loginSuccess');
    res.locals.uploadError = req.flash('uploadError');
    res.locals.uploadSuccess = req.flash('uploadSuccess');
    res.locals.discError = req.flash('discError');
    res.locals.discSuccess = req.flash('discSuccess');
    res.locals.contactSuccess = req.flash('contactSuccess');
    next();
})

//Routes
app.use('/', require('./routes/index'));
app.use('/admin', require('./routes/admin'));



const PORT = process.env.PORT || 5001;



app.listen(PORT, console.log(`Server started on port: ${PORT}`));