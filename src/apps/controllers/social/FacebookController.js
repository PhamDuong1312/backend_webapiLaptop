const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const config = require('config');
const User = require('../../models/user')
const FacebookLogin = () => {
    passport.use(new FacebookStrategy({
        clientID: config.facebook.FACEBOOK_APP_ID,
        clientSecret: config.facebook.FACEBOOK_APP_SECRET,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['id', "displayName", 'email']
    },
        async function (accessToken, refreshToken, profile, cb) {
            const newUser = {
                fullName: profile._json.name,
                email: profile._json.id,
                password:profile._json.id
            }
            let user = await User.findOne({ email: profile._json.id })
            if (!user) {
                user = await new User(newUser).save()
            }
            return cb(null, user);
        }
    ));
}
module.exports = FacebookLogin