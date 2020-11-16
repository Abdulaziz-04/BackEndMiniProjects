var express = require('express');
var multer = require('multer');
var cors = require('cors');

// require and use "multer"...

var app = express();
var upload = multer({
    limits: { fileSize: 10000000 }
})

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/hello', function(req, res) {
    res.json({ greetings: "Hello, API" });
});


app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
    if (req.file && req.file.size) {
        res.json({
            name: req.file.originalname,
            type: req.file.mimetype,
            size: req.file.size
        })


    } else {
        res.json({
            "error": "error with file upload"
        })
    }
})

app.listen(process.env.PORT || 3000, function() {
    console.log('Node.js listening ...');
});