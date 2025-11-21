const express = require('express'); // express framework
const mongoose = require('mongoose'); // handle db
const cors = require('cors'); // access to cross origin policy i.e. to access apis
const { nanoid } = require('nanoid'); // create a random id
const validUrl = require('valid-url'); // url verifier
const dotenv = require('dotenv'); // handle .env files
const { MongoMemoryServer } = require('mongodb-memory-server'); // in-memory mongo for local/dev

dotenv.config(); // call to env function
const app = express(); // call to express
const port = process.env.PORT || 3104;

// Middleware functions
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// for static assets
app.use(express.static('public'));

// mongodb schema and model
const urlSchema = new mongoose.Schema({
    original_url: { type: String, required: true },
    short_url: { type: String, required: true }
});
const URL = mongoose.model('urldb', urlSchema);

// REQUESTS
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/api/shorturl/new', async(req, res) => {
    const url = req.body.url;
    const id = nanoid(8);
    if (!validUrl.isWebUri(url)) {
        res.json({
            "error": "invalid url"
        });
    } else {
        try {
            const exists = await URL.findOne({ original_url: url });
            if (!exists) {
                const newUrl = new URL({
                    original_url: url,
                    short_url: id
                });
                await newUrl.save();
                res.json({
                    original_url: url,
                    short_url: id
                });
            } else {
                res.json({
                    original_url: url,
                    short_url: exists.short_url
                });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    }
});

app.get('/api/shorturl/:short_url?', async(req, res) => {
    try {
        const currentUrl = await URL.findOne({ short_url: req.params.short_url });
        if (currentUrl) {
            res.redirect(currentUrl.original_url);
        } else {
            res.status(404).json("NO URL found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// DB bootstrap (prefers real Mongo if MONGO_URI is provided, otherwise in-memory)
async function start() {
    let mongoUri = process.env.MONGO_URI;
    let memServer;
    if (!mongoUri) {
        memServer = await MongoMemoryServer.create();
        mongoUri = memServer.getUri();
        console.log('Using in-memory MongoDB instance');
    }

    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected');
        app.listen(port, function() {
            console.log(` Node.js listening to ${port} `);
        });
    } catch (err) {
        console.error('Mongo connection error:', err);
        if (memServer) {
            await memServer.stop();
        }
        process.exit(1);
    }
}

start();
