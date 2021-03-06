const mongoose = require('mongoose');

let boardSchema = mongoose.Schema({
    title : {type : String, required:[true, "제목을 입력해주세요 !"]},
    body : {type : String, required:[true, "내용을 입력해주세요 !"]},
    author : {type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
    count : { type : Number , default : 0 },
    createdAt : { type: Date, default : Date.now },
    updatedAt : { type : Date, default : null },
    comments : [
        {
           comAuthor: {type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
           memo : {type : String, required:[true, "댓글을 입력해주세요 !"]},
           comCreatedAt : { type : Date, default : Date.now }
       }
    ]
});

module.exports = mongoose.model("board",boardSchema);
