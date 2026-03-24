const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');

const app = express();
const sessionConfig = {
    secret: 'simpleSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
};
const campGrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const cookie = require('express-session/session/cookie');
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionConfig));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/campgrounds', campGrounds);
app.use('/campgrounds/:id/reviews', reviews);

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log('Database Connected');
    })
    .catch(err => {
        console.log('Connection Error');
        console.log(err);
    });

app.listen(3000, () => {
    console.log('Serving on Port 3000');
});

app.get('/', (req, res) => {
    res.render('home');
});

app.all('/{*splat}', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something Went Wrong!' } = err;
    res.status(statusCode).render('error', { err });
});