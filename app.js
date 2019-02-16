const express = require('express');
const ejs = require('ejs');
const path = require('path');
const multer = require('multer');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));


// Setting Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploadFiles/',
    filename: (req, file, cb) => {
        // path.extname(file.originalname) it will extract the extension of original file name
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const uploadM = multer({
    storage,         //it could be storage: storage but we're usind ES6; -----limits etc are optional
    limits: {fileSize: 1000000},      // to limit the file size(alwayes in bytes)...
    fileFilter: (req, file, cb) => {    
        checkfiletype(file, cb)
    }
});

function checkfiletype(file, cb){
    // Allowed EXTENSION type
    const filetypes = /jpeg|png|jpg|gif/;
    // testing the file's extension to the Allowed Extention types
    const extname = filetypes.test(path.extname(file.originalname));
    // checking the mime type
    const mime = filetypes.test(file.mimetype);

    if(mime && extname){
        return cb(null, true);
    }else{
        cb('ERR: Only images allowed');
    }

}

// @route Get /
// @desc rendring the form for file upload
app.get('/', (req, res) => {
    res.render('index');
});

// @route POST /
// @desc 
app.post('/uploadnik', (req, res) => {  // here route name must be same as defined in action attribute in the form
   uploadM.single('myimage')(req, res, (err)=> {
       if(err){
           res.render('index', {
               msg: err
           }); 
       }else{
           if(req.file === undefined){
               res.render('index', {
                   msg: 'Err: No file Selected'
               }); 
           }else{
               res.render('index', {
                   msg: 'File Uploaded',
                   file: `uploadFiles/${req.file.filename}`
               });
           }
       }
   }) ;
});

port = 3030;
app.listen(port, (err, suc) => {
    if(err){
        return new Error('something wrong is going on');
    }
    console.log(`listening at ${port}`);
});