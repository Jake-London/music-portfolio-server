const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const { ensureAuthenticated, deleteAuthenticate } = require('../config/auth');

// DB models
const User = require('../models/User');
const Track = require('../models/Track');
const Discography = require('../models/Discography');

//Login Page
router.get('/login', (req, res) => res.render('login', {title: "- Login"}));

// Login User
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/admin/login',
        failureFlash: true
    })(req, res, next);
    
});


//Logout User
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('loginSuccess', 'You are logged out');
    res.redirect('/');
});


router.post('/upload', ensureAuthenticated, (req, res) => {
    console.log(req.body);
    if (req.files) {
        
        if (req.files.hasOwnProperty('cover') && req.files.hasOwnProperty('song')) {
            
            if (req.files.cover.mimetype == 'image/gif' || req.files.cover.mimetype == 'image/png' || req.files.cover.mimetype == 'image/jpeg') {
                
                if (req.files.song.mimetype == 'audio/mpeg' || req.files.song.mimetype == 'audio/flac') {

                    const song = req.files.song;
                    const cover = req.files.cover;
                    
                    const { songName, songBpm, songDuration, isAvailable } = req.body;
                    const songType = 'mp3';

                    const isAvailableBoolean = isAvailable === 'on' ? true : false;
                    console.log(`Boolean = ${isAvailableBoolean}`);
                    
                    const newTrack = new Track({songName, songBpm, songDuration, songType, songPath: '', coverPath: '', isAvailable: isAvailableBoolean});
                    
                    let directoryPath = path.join(__dirname, '..', 'public', 'tracks', newTrack._id.toString());
                    let songUploadPath = path.join(directoryPath, song.name);
                    let coverUploadPath = path.join(directoryPath, cover.name);

                    const songPath = '/tracks/' + newTrack._id.toString() + '/' + song.name;
                    const coverPath = '/tracks/' + newTrack._id.toString() + '/' + cover.name;

                    newTrack.songPath = songPath;
                    newTrack.coverPath = coverPath;

                    console.log(newTrack);
                    
                    fs.mkdir(directoryPath, (err) => {
                        if (err) {
                            console.log(err);
                            res.redirect('/admin');
                        }

                        song.mv(songUploadPath, (err) => {
                            if (err) {
                                console.log(err);
                                req.flash('uploadError', 'Error uploading audio file');
                                
                            }
                            cover.mv(coverUploadPath, async (err) => {
                                if (err) {
                                    console.log(err);
                                    req.flash('uploadError', 'Error uploading cover');
                                } else {
                                    const track = await newTrack.save();
                                    req.flash('uploadSuccess', 'Files uploaded successfully');
                                }
                                res.redirect('/admin');
                            });
                            
                        });
                    });

                } else {
                    req.flash('uploadError', 'Incorrect audio format. Support formats include .mp3');
                    res.redirect('/admin');
                }

            } else {
                req.flash('uploadError', 'Incorrect image format. Supported formats include .gif, .png, .jpg');
                res.redirect('/admin');
            }
        } else {
            req.flash('uploadError', 'Files not selected.');
            res.redirect('/admin');
        }
    } else {
        req.flash('uploadError', 'Files not selected.');
        res.redirect('/admin');
    }

});

router.post('/upload/disc', ensureAuthenticated, (req, res) => {
    console.log(req.body);

    if (req.files) {
        
        if (req.files.hasOwnProperty('cover')) {

            if (req.files.cover.mimetype == 'image/gif' || req.files.cover.mimetype == 'image/png' || req.files.cover.mimetype == 'image/jpeg') {

                const discCover = req.files.cover;

                const { discName, discSpotify } = req.body;

                const newDisc = new Discography({ discName, discSpotify, discCoverPath: ''});

                let discCoverPath = '/discography/' + newDisc._id.toString() + '/' + discCover.name;
                let directoryPath = path.join(__dirname, '..', 'public', 'discography', newDisc._id.toString());
                let discCoverUploadPath = path.join(directoryPath, discCover.name);

                newDisc.discCoverPath = discCoverPath;

                console.log(newDisc);

                fs.mkdir(directoryPath, (err) => {
                    if (err) {
                        console.log(err);
                        req.flash('discError', 'Error uploading discography, please try again');
                        res.redirect('/admin');
                    }

                    discCover.mv(discCoverUploadPath, async (err) => {
                        if (err) {
                            console.log(err);
                            req.flash('discError', 'Error uploading cover');
                        } else {
                            const disc = await newDisc.save();
                            req.flash('discSuccess', 'Files uploaded successfully');
                        }
                        res.redirect('/admin');
                    })
                })
                
            } else {
                req.flash('discError', 'Incorrect image format. Supported formats include .gif, .png, .jpg');
                res.redirect('/admin');
            }

        } else {
            req.flash('discError', 'Files not selected.');
            res.redirect('/admin');
        }

    } else {
        req.flash('discError', 'Files not selected.');
        res.redirect('/admin');
    }
});

router.delete('/delete/:id', deleteAuthenticate, async (req, res) => {
    console.log(req.params.id);
    const _id = req.params.id;
    const track = await Track.findOne({_id});

    console.log(track);

    if (!track) {
        res.json({msg: "This resource does not exist", status:'err'});
    } else {
        let dir = path.join(__dirname, '..', 'public', 'tracks', track._id.toString());
        fs.rmdir(dir, {recursive: true}, (err) => {
            if (err) throw err;
            console.log(`${dir} has been deleted.`);

            Track.deleteOne({_id}, function (err) {
                if (err) res.json({msg: 'didn worked', status:'err'});
                else {
                    res.json({msg:'worked', status: 'ok'});
                }
            });
        });
        
    }


});

router.delete('/discography/delete/:id', deleteAuthenticate, async (req, res) => {
    console.log(req.params.id);
    const _id = req.params.id;
    const discography = await Discography.findOne({_id});

    console.log(discography);

    if (!discography) {
        res.json({msg: "This resource does not exist", status: "err"});
    } else {
        let dir = path.join(__dirname, '..', 'public', 'discography', discography._id.toString());
        fs.rmdir(dir, {recursive: true}, (err) => {
            if (err) throw err;
            console.log(`${dir} has been deleted. (${discography.discName})`);

            Discography.deleteOne({_id}, function (err) {
                if (err) res.json({msg: 'Could not delete document', status: 'err'});
                else {
                    res.json({msg: 'Document deleted', status: 'ok'});
                }
            });
        })
    }
});

router.patch('/update-available/:id', deleteAuthenticate, async (req, res) => {
    console.log(req.params.id);
    const _id = req.params.id;

    const track = await Track.findOne({_id});

    console.log(track);

    track.isAvailable = !track.isAvailable;
    await track.save();
    res.json({track, status: 'ok'});
})



module.exports = router;