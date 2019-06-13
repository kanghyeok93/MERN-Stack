const express = require('express');
const router = express.Router();

const passport = require("../config/passport");

router.get('/login',function(req,res){
   let username = req.flash("username")[0];
   let errors = req.flash("errors")[0] || {};
   res.json({username : username, errors : errors})
});

router.post('/login',function(req,res,next){
   let errors = {};
   let isValid = true;
   if(!req.body.username){
       isValid = false;
       errors.username = "아이디를 입력해주세요 !";
   }
   if(!req.body.password){
       isValid = false;
       errors.password = "비밀번호를 입력해주세요 !";
   }
   if(isValid){
       next();
   }else{
       req.flash("errors",errors);
       res.json(errors)
   }
},
    passport.authenticate('local-login'),
    (req, res) => {
        console.log('logged in', req.user);
        let userInfo = {
            username : req.user.username,
            msg : "login"
        };
        res.json(userInfo);
    }
);

router.get('/home',function(req,res){
    console.log('===== user!! =====');
    console.log(req.user);
    if (req.user) {
        res.json({ user: req.user })
    } else {
        res.json({ user: null })
    }});

router.post('/logout', (req, res) => {
    if (req.user) {
        req.logout();
        res.send({ msg: 'logging out' })
    } else {
        res.send({ msg: 'no user to log out' })
    }
});

module.exports = router;