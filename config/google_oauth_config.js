const GoogleStrategy = require('passport-google-oauth20');
const { userModel } = require('../models/user');
const passport = require('passport');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
        let user = await userModel.findOne({ email: profile.emails[0].value });

        if (!user) {
            user = new userModel({
                name: profile.displayName,
                email: profile.emails[0].value,
            });
            await user.save();
        }

        cb(null, user);
    } catch (err) {
        cb(err, false);
    }
  }
));

// Adding user ID to session
passport.serializeUser(function(user, cb) {
    cb(null, user._id);
});

// Retrieving user by ID from session
passport.deserializeUser(async function(id, cb) {
    try {
        const user = await userModel.findById(id);
        if (!user) {
            return cb(new Error('User not found'), null);
        }
        cb(null, user);
    } catch (err) {
        cb(err, null);
    }
});

module.exports = passport;
