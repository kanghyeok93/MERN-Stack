const express = require('express');
const router = express.Router();
let util = require('../../util');
let BoardModel = require('../models/board.model');

router.get('/',function(req,res){

    var page = req.param('page');
    if(page == null) {page = 1}

    let skipSize = (page -1) * 5;
    let limitSize = 5;
    let pageNum = 1;

    BoardModel.count(function(err,totalCount){
        if(err) throw err;

        pageNum = Math.ceil(totalCount/limitSize);

        BoardModel.find({}).populate("author").sort("-createdAt")
            .skip(skipSize).limit(limitSize).exec(function(err,result){
            if(err) return res.json(err);
            res.json({result,pageNum});
        });
    });
});

router.post('/search',function(req,res){
    var keyword = req.body.keyword;
    var searchCondition = { $regex : keyword };

        BoardModel.find({ $or:[{title:searchCondition},{body:searchCondition}]})
            .populate("author").sort("-createdAt").exec(function (err, result) {
            if (err) return res.json(err);
            res.json({result : result});
        });
});

router.get('/write',util.isLoggedin,function(req,res){
    var post = req.flash("post")[0] || {};
    var errors = req.flash("errors")[0] || {};
    res.json({post : post ,errors : errors});
});

// add
router.post('/add',util.isLoggedin,function(req,res){
    req.body.author = req.user._id;
    let newBoardModel = new BoardModel(req.body);
    newBoardModel.save()
        .then(() => {
            res.json('Add complete');
        })
        .catch(err => {
            req.flash('post',req.body);
            req.flash('errors', util.parseError(err));
            res.json(util.parseError(err));
        })
});

// show
router.get('/show/:id',function(req,res){
    BoardModel.findOne({_id : req.params.id})
        .populate("author")
        .exec(function(err,result){
            if(err) return res.json(err);

            result.count += 1;

            result.save().then(()=> {
                res.json(result);
            })
            .catch(err => {
                    console.log(err);
            })

        });
});

// edit
router.get('/edit/:id',util.isLoggedin, checkPermission,function(req,res){
    var post = req.flash('post')[0];
    var errors = req.flash('errors')[0] || {};
    if(!post){
        BoardModel.findById(req.params.id,function(err,post){
            if(err) return res.json(err);
            res.json({post : post, errors : errors})
        });
    }else{
        post._id = req.params.id;
        res.json({post : post, errors:errors})
    }
});

// update
router.post('/update/:id',util.isLoggedin, checkPermission,function(req,res){
    BoardModel.findById(req.params.id,function(err,result){
        req.body.updatedAt = Date.now();

        if(!result){
            res.status(404).send("data is not found")
        }else{
            result.title = req.body.title;
            result.body = req.body.body;
            result.updatedAt = req.body.updatedAt;

            result.save().then(()=> {
                res.json('Update complete');
            })
            .catch(err => {
                req.flash("post",req.body);
                req.flash("errors",util.parseError(err));
                res.json(util.parseError(err));
            })
        }
    });
});

// delete
router.get('/delete/:id',util.isLoggedin, checkPermission,function(req,res){
    BoardModel.findByIdAndRemove({_id : req.params.id},function(err,result){
        if(err) return res.json(err);
        res.json('Successfully removed')
    });
});

module.exports = router;

function checkPermission(req,res,next){
    BoardModel.findOne({_id : req.params.id}, function(err,result){
        if(err) return res.json(err);
        if(result.author != req.user.id) return util.noPermission(req,res);

        next();
    })
}
