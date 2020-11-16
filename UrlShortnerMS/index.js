const express = require('express'); //express framework
const mongoose = require('mongoose'); //handle db 
const cors = require('cors'); //access to cross origin policy i.e. to access apis
const shortId = require('shortid') //create a random id
const validUrl = require('valid-url') //url verifier 
const bodyParser = require('body-parser') //body parser to validate parsed data
const dotenv = require("dotenv"); // handle .env files
const app = express(); //call to express
dotenv.config(); // call to env function


//Connect to DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })


//Middleware funtion
app.use(cors());
//for static assets
app.use(express.static('public'));
//body-parser allows to pass input in req.body.var
app.use(bodyParser.urlencoded({ extended: false }))

//mongodb schema and model
const urlSchema = new mongoose.Schema({
    original_url: String,
    short_url: String
})
const URL = mongoose.model("urldb", urlSchema)

//REQUESTS
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/api/shorturl/new', async(req, res) => {
    const url = req.body.url
    const id = shortId.generate()
    if (!validUrl.isWebUri(url)) {
        res.json({
            "error": "invalid url"
        })
    } else {
        try {
            let exists = await URL.findOne({ original_url: url })
            const new_url = new URL({
                original_url: url,
                short_url: id
            })
            if (!exists) {
                await new_url.save()
                res.json({
                    original_url: url,
                    short_url: id
                })
            } else {
                res.json({
                    original_url: url,
                    short_url: id
                })
            }


        } catch (err) {
            res.status(500).send("Server Error")

        }
    }

})

app.get('/api/shorturl/:short_url?', async(req, res) => {
    try {
        const current_url = await URL.findOne({ short_url: req.params.short_url })
        if (current_url) {
            res.redirect(current_url.original_url)
        } else {
            res.status(404).json("NO URL found")
        }
    } catch (err) {
        res.status(500).send("Server Error")
    }

})



//PORT HANDLING
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log(` Node.js listening to ${port} `);
});