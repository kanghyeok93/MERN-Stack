const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

const User = require("../models/user.model");

passport.serializeUser(function(user,done){
    console.log('*** serializeUser called, user: ');
    console.log(user);
    console.log('---------');
    done(null,user.id)
});

passport.deserializeUser(function(id,done){
    User.findOne({_id:id},function(err,user){
        console.log('*** Deserialize user, user:');
        console.log(user);
        console.log('---------');
        done(err,user);
   })
});

passport.use("local-login",
    new LocalStrategy({
        usernameField : "username",
        passwordField : "password",
        passReqToCallback : true
    },
    function(req,username,password,done){
        User.findOne({ username:username})
        .select("password username")
            .exec(function(err,user){
                if(err) return done(err);
                if(user && user.authenticate(password)){
                    return done(null,user);
                }else{
                    return done(null, false);
                }
            })
          }
        )
    );

module.exports = passport;