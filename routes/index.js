const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const nodemailer = require('nodemailer');

const keys = require('../config/emailKeys');

const Message = require('../models/Message');
const Track = require('../models/Track');
const Discography = require('../models/Discography');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: keys.user,
        clientId: keys.clientId,
        clientSecret: keys.clientSecret,
        refreshToken: keys.refreshToken,
        accessToken: keys.accessToken
    }
});

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

    console.log(`Page Number: ${page} |`, `Start Index: ${index}`);

    await Track.countDocuments({}, async function(err, count) {
        console.log(`Total documents: ${count}`);

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
    
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;
    const ip = req.headers['x-real-ip'] || 'No IP found';

    if (!name || !email || !subject || !message) {
        console.log('Undefined value detected in form submission');
        req.flash('contactError', 'Fill out all required fields');
    } else {

        const mail =  {
            from: `Contact Form Submission - prodbysixon.com <${keys.user}>`,
            to: `${keys.sendTo}`,
            subject: "Contect Form Submitted",
            text: `Name: ${name}, Email: ${email}, Subject: ${subject}, Message: ${message}, IP: ${ip}`,
            html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Subject: ${subject}</p><p>Message: ${message}</p><p>IP: ${ip}</p>`
        };

        transporter.sendMail(mail, async function(err, info) {
            let sentEmail;

            if (err) {
                sentEmail = false;
                console.log(err);   
            } else {
                sentEmail = true;
                console.log("info.messageId: " + info.messageId);
                console.log("info.envelope: " + info.envelope);
                console.log("info.accepted: " + info.accepted);
                console.log("info.rejected: " + info.rejected);
                console.log("info.pending: " + info.pending);
                console.log("info.response: " + info.response);
            }

            const newMessage = new Message({name, email, subject, message, ip, sentEmail});
            const submission = await newMessage.save();
            console.log(submission);
            transporter.close();
        });

        req.flash('contactSuccess', 'Message submitted successfully');
    }
    
    
    res.redirect('/pricing');
})


module.exports = router;