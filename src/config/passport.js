const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {userGoogle, user} = require('../app/models/User');

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: '996977187718-a5tkeahsoifrvcjr0a2pct28bbfus10n.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await userGoogle.findOne({
          googleId: profile.id
        });

        if (user) {
          done(null, user);
        } else {
          const newUser = {
            googleId: profile.id,
            username: profile.displayName,
            photo: profile.photos[0].value,
            // email: profile.user_name,
          };

          user = await userGoogle.create(newUser);
          done(null, user);

        }
      } catch (error) {
        console.log(error);
      }
    }
  ));
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    userGoogle.findById(id, function (err, user) {
      done(err, user);
    });
  });
}

