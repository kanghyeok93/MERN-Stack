const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

let userSchema = mongoose.Schema({
   username : {
       type : String,
       required:[true,"아이디를 입력해주세요 !"],
       match:[/^.{4,12}$/, "아이디는 4자리 이상 12자리 이하로 설정해주세요 !"],
       trim:true,
       unique:true
   },
   password : {
       type : String,
       required:[true,"비밀번호를 입력해주세요 !"],
       select:false
   },
   name : {
       type : String,
       required:[true,"이름을 입력해주세요 !"],
       match:[/^.{3,12}$/, "이름은 3자리 이상 12자리 이하로 설정해주세요 !"],
       trim:true
   },
   email : {
       type : String,
       match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,"이메일 형식이 맞지 않습니다 !"],
       trim : true
   }
},{
    toObject : { virtuals : true}
});

userSchema.virtual("passwordConfirmation")
    .get(function(){ return this._passwordConfirmation;})
    .set(function(value){ this._passwordConfirmation = value});

userSchema.virtual("originalPassword")
    .get(function(){ return this._originalPassword;})
    .set(function(value){ this._originalPassword = value});

userSchema.virtual("currentPassword")
    .get(function(){ return this._currentPassword;})
    .set(function(value){ this._currentPassword = value});

userSchema.virtual("newPassword")
    .get(function(){ return this._newPassword;})
    .set(function(value){ this._newPassword = value});

let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
let passwordRegexErrorMessage = "비밀번호 형식은 알파벳과 숫자를 조합한 8자리 이상이여야 합니다 !";

userSchema.path("password").validate(function(v){
   let user = this;

   if(user.isNew){
        if(!user.passwordConfirmation){
            user.invalidate("passwordConfirmation", "비밀번호 확인이 필요합니다 !");
        }
        if(!passwordRegex.test(user.password)){
            user.invalidate("password",passwordRegexErrorMessage);
        }else if(user.password !== user.passwordConfirmation){
            user.invalidate("passwordConfirmation", "비밀번호 확인이 일치하지 않습니다 !");
        }
   }

   if(!user.isNew){
       if(!user.currentPassword){
           user.invalidate("currentPassword", "현재 비밀번호를 입력해주세요 !");
       }
       if(user.currentPassword && !bcrypt.compareSync(user.currentPassword, user.originalPassword)){
           user.invalidate("currentPassword", "현재 비밀번호가 일치하지 않습니다 !");
       }
       if(user.newPassword && !passwordRegex.test(user.newPassword)) {
           user.invalidate('newPassword', passwordRegexErrorMessage);
       }else if(user.newPassword !== user.passwordConfirmation){
            user.invalidate("passwordConfirmation", "비밀번호 확인이 일치하지 않습니다 !");
       }
   }
});

userSchema.pre("save",function(next){
   let user = this;
   if(!user.isModified("password")){
       return next();
   }else{
       user.password = bcrypt.hashSync(user.password);
       return next();
   }
});

userSchema.methods.authenticate = function(password){
    let user = this;
    return bcrypt.compareSync(password, user.password)
};

module.exports = mongoose.model("user",userSchema);