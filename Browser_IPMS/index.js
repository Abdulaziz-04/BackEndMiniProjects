const express = require('express');
const cors = require('cors');
const app = express();
const requestIp = require('request-ip');


//midlleware functions
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204
app.use(requestIp.mw())
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/whoami', (req, res) => {
    res.json({ "ipaddress": req.clientIp, "language": req.headers["accept-language"], "software": req.get('User-Agent') })
})




// give this service its own default port so it can run alongside the others
const port = process.env.PORT || 3101;

// listen for requests :)
const listener = app.listen(port, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});
