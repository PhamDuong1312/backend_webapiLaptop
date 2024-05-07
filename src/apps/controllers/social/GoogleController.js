const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('config');
const passport = require('passport')
const bcrypt=require('bcrypt')
const User = require('../../models/user')

const GoogleLogin = () => {
    passport.use(new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
    },
        async function (accessToken, refreshToken, profile, cb) {
            const newUser = {
                fullName: profile._json.given_name,
                email: profile._json.email,
                password:profile._json.sub
            }
            let user = await User.findOne({ email: profile._json.email })
            if (!user) {
                user = await new User(newUser).save()
            }
            return cb(null, user);
        }
    ));
}

module.exports = GoogleLogin;