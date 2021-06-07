const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

module.exports = function(passport) {
    console.log('here1');
    passport.use(new LocalStrategy({usernameField: 'username'},
        async function (username, password, done) {

            
            //Find User
            const user = await User.findOne({username: username});
            

            //Check if user exists
            if (!user) {
                return done(null, false, {message: "Username/Password Invalid"});
            }
            console.log(user);
            //Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;

                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: "Username/Password Invalid"});
                }
            });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}