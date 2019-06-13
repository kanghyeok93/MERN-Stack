const express = require('express');
const router = express.Router();

const User = require('../models/user.model');
const util = require('../../util');

router.get('/',util.isLoggedin,function(req,res){
   User.find({}).sort({username:1}).exec(function(err,users){
      if(err) return res.json(err);
      res.json(users);
   });
});

router.get('/sign',function(req,res){
    let user = req.flash("user")[0] || {};
    let errors = req.flash("errors")[0] || {};
    res.json({user : user ,errors : errors});
});

//add
router.post('/add',function(req,res){
    let newUser = new User(req.body);
    newUser.save()
        .then(() => {
            res.json('Add complete');
        })
        .catch(err => {
            req.flash('user',req.body);
            req.flash('errors', util.parseError(err));
            res.json(util.parseError(err));
        })
});

//show
router.get("/show/:username",util.isLoggedin,function(req,res){
    User.findOne({username : req.params.username},function(err,user){
        if(err) return res.json(err);
        res.json(user);
    })
});

//edit
router.get("/edit/:username",util.isLoggedin,checkPermission,function(req,res){
    let user = req.flash('user')[0];
    let errors = req.flash('errors')[0] || {};
    if(!user){
        User.findOne({username : req.params.username},function(err,user){
            if(err) return res.json(err);
            res.json({username : req.params.username, user : user, errors : errors})
        });
    }else{
        res.json({username : req.params.username, user : user, errors : errors})
    }
});

// update
router.post("/update/:username",util.isLoggedin,checkPermission,function(req,res){
    User.findOne({username : req.params.username})
        .select({password:1})
        .exec(function(err,user){
            if(err) return res.json(err);

            user.originalPassword = user.password;
            user.password = req.body.newPassword ? req.body.newPassword : user.password;
            for(var p in req.body) {
                user[p] = req.body[p]
            }

            user.save().then(()=> {
                res.json('Update complete');
                })
                .catch(err => {
                    req.flash("user",req.body);
                    req.flash("errors",util.parseError(err));
                    res.json(util.parseError(err));
                })
        })
});

module.exports = router;

function checkPermission(req,res,next){
    User.findOne({username : req.params.username}, function(err,result){
        if(err) return res.json(err);
        if(result.id != req.user.id) return util.noPermission(req,res);

        next();
    })
}