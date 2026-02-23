const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const CampGround = require('./models/campground');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/makecampground', async (req, res) => {
    const camp = new CampGround({
        title: 'Gaboor Palace',
        price: '0',
        description: 'Cheap Farting Farm',
        location: 'Philadelphia'
    });
    await camp.save();
    res.send(camp);
});