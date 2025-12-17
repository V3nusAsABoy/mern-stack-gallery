const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const fs = require('fs');
const Drawing = require('./dbmodules/drawing');
const session = require('express-session');
const dbstore = require('connect-mongo');
const jwt = require('jsonwebtoken');
const User = require('./dbmodules/User');
const cookieParser = require('cookie-parser');

const salt = bcrypt.genSaltSync(10);

mongoose.connect(process.env.MONGOURL);

app.use(cors({credentials:true,origin:process.env.ORIGIN}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(session({
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: dbstore.create({mongoUrl: process.env.MONGOURL}),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.post('/register', async (req, res) => {
    const {username,password} = req.body;
    userDoc = await User.findOne({username});
    if(userDoc){
        return res.status(409).json('username taken');
    }
    try{
    const userDoc = await User.create({
        username,
        password:bcrypt.hashSync(password,salt),
        admin:false
    });
    req.session.admin = userDoc.admin;
    jwt.sign({usernam,id:userDoc.id},process.env.SECRET,{},(err,token) => {
        if(err) throw err;
        res.cookie('token', token, {httpOnly:true, secure: process.env.NODE_ENV, sameSite: 'Strict'}).json({
            id:userDoc._id,
            username
        });
    });
    } catch(e) {
        res.status(400).json(e);
    }
});

app.post('/login', async (req,res) => {
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk){
        req.session.admin = userDoc.admin;
        jwt.sign({username,id:userDoc._id}, process.env.SECRET, {}, (err,token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV, sameSite: 'Strict' }).json({
                id:userDoc._id,
                username,
            });
        })
    } else {
        res.status(400).json('wrong credentials');
    }

});

app.post('/drawing', uploadMiddleware.single('file'), async (req,res) => {
    const {originalname,path} = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path+"."+ext;
    fs.renameSync(path, newPath);

    const {title,artist} = req.body;
    const postDoc = await Drawing.create({
        title,
        artist,
        art:newPath,
    })

    res.json(postDoc);
});

app.get('/drawings', async(req,res) => {
    res.json(await Drawing.find());
});

app.listen(process.env.PORT);