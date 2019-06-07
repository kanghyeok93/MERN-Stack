const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
// const cors = require('cors');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/passport');
const app = express();
const PORT =  process.env.PORT || 8080;

const boardRoute = require('./routes/board.route');
const userRoute = require('./routes/user.route');
const homeRoute = require('./routes/home.route');
const config = require('./DB');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || config.DB, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error !!!'));
db.once('open',function(){
    console.log('connected');
});

// app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(flash());
app.use(session({
    secret:'kanghyeok93',
    resave:true,
    saveUninitialized:true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/',homeRoute);
app.use('/board',boardRoute);
app.use('/user',userRoute);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('../build'));

    app.get('*', (req,res) => {
        res.sendFile(path.join(__dirname,'build','index.html')); // relative path
    })
}

app.listen(PORT,function(){
    console.log('Server is running on Port:', PORT);
});