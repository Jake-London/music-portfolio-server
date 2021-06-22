const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const Track = require('../models/Track');
const Discography = require('../models/Discography');

router.get('/', (req, res) => res.render('home'));

router.get('/search', async (req, res) => {
    console.log(req.query.name);
    let songName = req.query.name;
    songName = songName.replace(/\(/gi, '\\(');
    songName = songName.replace(/\)/gi, '\\)');
    console.log(songName);

    const results = await Track.find({songName: { "$regex": songName, "$options": "i" }});


    res.json(results);
})

router.get('/admin', ensureAuthenticated, async (req, res) => {
    console.log(req.user);

    const discographyList = await Discography.find().sort({_id:-1});

    res.render('dashboard', {user: req.user, discographyList});
});

router.get('/tracklist/:num', async (req, res) => {
    
    const page = req.params.num;
    const index = page * 25;

    console.log(page, index);

    await Track.countDocuments({}, async function(err, count) {
        console.log(count);

        if (index < count) {
            const trackList = await Track.find().sort({_id:-1}).limit(25).skip(index);
            res.json({trackList, count});
        } else {
            res.json({err: "No more songs"});
        }
    })
});

router.get('/track/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const track = await Track.findOne({_id});
        console.log(track);
        res.render('track', {track});
    } catch {
        res.render('404');
    }


});

router.get('/about', async (req, res) => {
    const discographyList = await Discography.find().sort({_id:-1}).limit(25);
    console.log(discographyList);
    res.render('about', {discographyList});
});

router.get('/pricing', (req, res) => res.render('pricing'));

router.post('/contact', (req, res) => {
    console.log(req.body);
    req.flash('contactSuccess', 'Message submitted successfully');
    res.redirect('/pricing');
})


module.exports = router;