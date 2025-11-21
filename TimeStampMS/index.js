const exp = require('express')
const app = exp()
const cors = require('cors')

//allows us to access other web APIs which is generally prohibited by SOP
//middleware functions
app.use(cors({ optionsSuccessStatus: 200 }))
app.use(exp.static("public"))

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})


// unique default port so all mini-services can co-run
const port = process.env.PORT || 3103;

const listener = app.listen(port, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});

//Verify date if not available use current Date for the url
app.get('/api/timestamp/:date_string?', (req, res) => {
    const dateString = req.params.date_string
    let date
    if (!dateString) {
        date = new Date()
    } else {
        if (!isNaN(dateString)) {
            date = new Date(parseInt(dateString))
        } else {
            date = new Date(dateString)
        }
    }

    if (date.toString() === 'Invalid Date') {
        res.json({ "error": "Invalid Date" })
    } else {
        res.json({ "unix": date.getTime(), "utc": date.toUTCString() })
    }
})
