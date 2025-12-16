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

mongoose.connect(process.env.MONGOURL);

app.use(cors({credentials:true,origin:process.env.ORIGIN}));
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

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

