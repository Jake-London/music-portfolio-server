const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const Track = require('../models/Track');
const Discography = require('../models/Discography');

router.get('/', (req, res) => res.render('home'));

router.get('/admin', ensureAuthenticated, async (req, res) => {
    console.log(req.user);

    const discographyList = await Discography.find().sort({_id:-1});

    res.render('dashboard', {user: req.user, discographyList});
});

router.get('/tracklist', async (req, res) => {
    
    const trackList = await Track.find().sort({_id:-1}).limit(25);

    // console.log(trackList);

    res.json(trackList);


});

router.get('/about', async (req, res) => {

    const discographyList = await Discography.find().sort({_id:-1}).limit(25);

    console.log(discographyList);


    res.render('about', {discographyList});
});

router.get('/contact', (req, res) => res.render('contact'));

router.post('/contact', (req, res) => {
    console.log(req.body);

    req.flash('contactSuccess', 'Message submitted successfully');
    res.redirect('/contact');
})


module.exports = router;