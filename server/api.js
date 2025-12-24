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

app.get('/cookie-check', (req, res) => {
    console.log('=== COOKIE CHECK ===');
    console.log('All cookies received:', req.cookies);
    console.log('Token exists?', !!req.cookies.token);
    console.log('Token value length:', req.cookies.token ? req.cookies.token.length : 0);
    console.log('Environment:', process.env.NODE_ENV);
    
    res.json({
        cookies: Object.keys(req.cookies),
        hasToken: !!req.cookies.token,
        tokenPreview: req.cookies.token ? req.cookies.token.substring(0, 20) + '...' : null,
        tokenLength: req.cookies.token ? req.cookies.token.length : 0,
        sessionId: req.sessionID,
        sessionExists: !!req.sessionID,
        headers: {
            origin: req.headers.origin,
            'user-agent': req.headers['user-agent']
        }
    });
});

app.post('/logout', (req, res) => {
    console.log('🚨 LOGOUT CALLED - Current cookies:', Object.keys(req.cookies));
    
    // CRITICAL: These settings MUST match EXACTLY how cookies were set
    // From your code, cookies are set with:
    // - secure: process.env.NODE_ENV === 'production' 
    // - sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
    // - httpOnly: true
    // - path: '/' (default)
    
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Define EXACT settings that match login/register
    const exactCookieSettings = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
        path: '/',
        // These force expiration
        expires: new Date(0), // Past date
        maxAge: 0 // Zero age
    };
    
    console.log('🔧 Using cookie settings:', exactCookieSettings);
    
    // Method 1: Set empty value with expired date (MOST RELIABLE)
    res.cookie('token', '', exactCookieSettings);
    
    // Method 2: Also call clearCookie (belt and suspenders)
    res.clearCookie('token', exactCookieSettings);
    
    // Do the same for session cookie
    res.cookie('connect.sid', '', exactCookieSettings);
    res.clearCookie('connect.sid', exactCookieSettings);
    
    // Destroy the session in store
    req.session.destroy((err) => {
        if (err) {
            console.error('❌ Session destroy error:', err);
        } else {
            console.log('✅ Session destroyed in store');
        }
        
        // Send response
        res.json({
            success: true,
            message: 'Logged out - cookies should be cleared',
            settingsUsed: exactCookieSettings,
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString()
        });
    });
});

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