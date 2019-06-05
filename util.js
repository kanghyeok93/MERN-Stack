let util = {};

util.parseError = function(errors){
    let parsed = {};
    if(errors.name == 'ValidationError'){
        for(let name in errors.errors){
            let validationError = errors.errors[name];
            parsed[name] = { message : validationError.message }
        }
    }else if(errors.code == "11000" && errors.errmsg.indexOf("username") > 0 ){
        parsed.username = { message : "이미 존재하는 아이디 입니다 !"};
    }else{
        parsed.unhandled = JSON.stringify(errors);
    }
    return parsed;
};

util.isLoggedin = function(req,res,next){
    if(req.isAuthenticated()) {
        next()
    }else{
        req.flash("errors",{login : "Please login first"});
        res.json('login-eroror')
    }
};

util.noPermission = function(req,res){
    req.flash("errors",{login : "You don't have permission"});
    req.logout();
    res.json('permission-error')
};

module.exports = util;