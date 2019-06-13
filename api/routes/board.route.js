const express = require('express');
const router = express.Router();

let util = require('../../util');
let BoardModel = require('../models/board.model');

router.get('/',function(req,res){

    let page = req.param('page');
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

// search
router.post('/search',function(req,res){
    let keyword = req.body.keyword;
    let searchCondition = { $regex : keyword };

        BoardModel.find({ $or:[{title:searchCondition},{body:searchCondition}]})
            .populate("author").sort("-createdAt").exec(function (err, result) {
            if (err) return res.json(err);
            res.json({result : result});
        });
});

// write
router.get('/write',util.isLoggedin,function(req,res){
    let post = req.flash("post")[0] || {};
    let errors = req.flash("errors")[0] || {};
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

// reply add
router.post('/reply/:id',util.isLoggedin,function(req,res){
    req.body.comAuthor = req.user._id;

    BoardModel.findOne({_id : req.params.id},function(err,result){

        result.comments.unshift({ memo : req.body.reply, comAuthor : req.body.comAuthor });

        result.save()
            .then(() => {
                res.json('reply complete');
            })
            .catch(err => {
                req.flash('reply',req.body);
                req.flash('errors', util.parseError(err));
                res.json(util.parseError(err));
            })
    });
});

// show
router.get('/show/:id',function(req,res){
    BoardModel.findOne({_id : req.params.id})
        .populate("author comments.comAuthor")
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
    let post = req.flash('post')[0];
    let errors = req.flash('errors')[0] || {};
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

// reply delete
router.get('/reply/delete/:id/:_id',util.isLoggedin, ComcheckPermission,function(req,res){

    BoardModel.findOneAndUpdate(
        { '_id' : req.params._id }, { $pull : { 'comments': { '_id' : req.params.id }}} , function(req,result){
            result.save().then(()=> {
                res.json('comment complete');
            })
        }
    )
});

// delete
router.get('/delete/:id', util.isLoggedin, checkPermission,function(req,res){
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

function ComcheckPermission(req,res,next){
    BoardModel.find({_id : req.params._id},{_id:0, comments:{$elemMatch:{_id : req.params.id}}},function(err,result){

        if(err) return res.json(err);

        if(result[0].comments[0].comAuthor != req.user.id) return util.noPermission(req,res);
        next();
    })
}

