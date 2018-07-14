var express = require('express')
var bodyParser = require('body-parser')
var pythonShell = require('python-shell')
var moment = require('moment')
var mongojs = require("mongojs")

// Database configuration
// Use mongojs to hook the database to the db variable
var db = mongojs('test', ['data'])

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error)
})

// initialize express
var app = express()
var PORT = 3000

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }))

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"))
app.use(bodyParser.json())

// render homepage

app.get('/dbtest', function(req, res) {
    console.log("DBTEST")
    console.log(moment().format('MM/DD/YYYY h:mm:ss A'))
    db.data.find(function(error, found) {
        if (error) {
            console.log(error)
        } else {
            console.log(found)
            res.send(found)
        }
    })
})

app.get('/test', function(req, res) {
    // grab current temperature and humidity using DHT11 sensor on Raspberry Pi
    var options = {
    // designate which GPIO pins to be used
        args: ["11", "4"]
    }
    var newEntry = {}

    // run python script to take current temperature and humidity
    pythonShell.run("./AdafruitDHT.py", options, function(err, result) {
        if (err) throw err
        newEntry.timestamp = moment().format('MM/DD/YYYY h:mm:ss A')
        newEntry.temp = parseInt(result[0])
        newEntry.rh = parseInt(result[1])
        console.log(newEntry)
    })
})

app.get('/post', function(req, res) {
    console.log("POST")
    var options = {
    // designate which GPIO pins to be used
        args: ["11", "4"]
    }
    var newEntry = {}

    // run python script to take current temperature and humidity
    pythonShell.run("./AdafruitDHT.py", options, function(err, result) {
        if (err) throw err
        newEntry.timestamp = moment().format('MM/DD/YYYY h:mm:ss A')
        newEntry.temp = parseInt(result[0])
        newEntry.rh = parseInt(result[1])
        // console.log(newEntry)
        db.data.insert(newEntry, function(error, success) {
            // Log any errors from mongojs
            if (error) {
                console.log(error);
                res.send(error)
            } else {
                // Otherwise, send the mongojs response to the browser
                // This will fire off the success function of the ajax request
                console.log(success)
                res.send(success)
            }
        })
    })
})

app.get('/history', function(req, res) {
    console.log("HISTORY")
    console.log(moment().format('MM/DD/YYYY h:mm:ss A'))
    db.data.find(function(error, found) {
        if (error) {
            console.log(error)
        } else {
            console.log(found)
            res.send(found)
        }
    })
})

app.get('/home', function(req, res) {

})

app.listen(PORT, function() {
    console.log(`App running on port ${PORT}!`)
})




