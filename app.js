const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const CampGround = require('./models/campground');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log('Database Connected');
    })
    .catch(err => {
        console.log('Connection Error');
        console.log(err);
    });

app.listen(3000, () => {
    console.log('Serving on port 3000');
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', async (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds', async (req, res) => {
    const campground = new CampGround(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    res.render('campgrounds/show', { campground });
});