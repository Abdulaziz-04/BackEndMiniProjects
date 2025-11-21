const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const upload = multer({
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

// unique default port so all mini-services can co-run
const port = process.env.PORT || 3102;

app.listen(port, function() {
    console.log('Node.js listening ...');
});
