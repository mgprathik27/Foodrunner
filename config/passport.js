var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require("../models/user");
var database = require("./database");

module.exports = function(passport){
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = database.secret;
console.log("jwt_payload");
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log("hrer");
    console.log(jwt_payload._id);
    User.findOne({_id: jwt_payload._id}, function(err, user) {
        console.log(user);
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));   
}
