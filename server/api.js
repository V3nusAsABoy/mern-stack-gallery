const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const { check } = require('express-validator');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const fs = require('fs');
const Drawing = require('./dbmodules/drawing');
const session = require('express-session');
const dbsession = require('connect-mongodb-session')(session);
const jwt = require('jsonwebtoken');
const User = require('./dbmodules/User');
const cookieParser = require('cookie-parser');

const salt = bcrypt.genSaltSync(10);

const upload = multer();

mongoose.connect(process.env.MONGOURL);

app.use(cors({credentials:true,origin:process.env.ORIGIN}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.set('trust proxy', 1);

const dbstore = new dbsession({
    uri: process.env.MONGOURL,
    collection: 'sessions'
});

const getCookieSettings = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 1000 * 60 * 60 * 24,
});

app.use(session({
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: dbstore,
    proxy: true,
    cookie: getCookieSettings()
}));

app.post('/register', upload.none(), check('username').trim().escape(), async (req, res) => {
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
    jwt.sign({username,id:userDoc.id},process.env.SECRET,{},(err,token) => {
        if(err) throw err;
        res.cookie('token', token, getCookieSettings()).json({
            id:userDoc._id,
            username
        });
    });
    } catch(e) {
        res.status(400).json(e);
    }
});

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, process.env.SECRET, {}, (err,info) => {
        if(err) throw err;
        res.json(info);
    });
});

app.post('/login', check('username').trim().escape(), async (req,res) => {
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});
    if(!userDoc){
        return res.status(404).json('user not found');
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk){
        req.session.admin = userDoc.admin;
        jwt.sign({username,id:userDoc._id}, process.env.SECRET, {}, (err,token) => {
            if (err) throw err;
            res.cookie('token', token, getCookieSettings()).json({
                id:userDoc._id,
                username
            });
        })
    } else {
        res.status(401).json('wrong credentials');
    }

});

app.post('/logout', (req,res) => {
    res.clearCookie('token', getCookieSettings());

    req.session.destroy((err) => {
        if(err) {
            console.error('Logout error:', err);
            return res.status(500).json('logout error');
        }
        
        res.json('ok');
    });
})

app.get('/admin' , (req,res) => {
    if(req.session.admin == true){
        res.status(200).json('ok');
    } else {
        res.status(401).json(`${req.session.admin}`);
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

app.delete('/drawing/:id', async (req,res) => {
    const {id} = req.params;
    await Drawing.findByIdAndDelete(id);
    res.json('deleted');
});

app.listen(process.env.PORT);