var express = require('express')
var bodyParser = require('body-parser')
var pythonShell = require('python-shell')
var moment = require('moment')
var mongojs = require('mongojs')
var request = require('supertest')
var nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gaiaprojectapp@gmail.com',
        pass: 'Xotjrl06'
    }
})

// Database configuration
var db = mongojs('test', ['data'])
var userEmail = mongojs('test', ['emails'])

// MongoDB error handling
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

app.get('/post', function(req, res) {
    // take sensor reading and post timestamped temp/rh data to db
    console.log("POST")
    var options = {
    // designate which GPIO pins to be used
        args: ["11", "4"]
    }
    var newEntry = {}

    // run python script to take current temperature and humidity
    pythonShell.run("./AdafruitDHT.py", options, function(err, result) {
        if (err) {
            console.log(err)
        } else {
            newEntry.timestamp = moment().format('MM/DD/YYYY h:mm:ss A')
            newEntry.temp = parseInt(result[0])
            newEntry.rh = parseInt(result[1])

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

            db.emails.find(function(error, found) {
                if (error) {
                    console.log(error)
                } else {
                    // console.log(found)
                    var email = found[0].email
                    var rhHigh = found[0].rhHigh
                    var rhLow = found[0].rhLow
                    var tempHigh = found[0].tempHigh
                    var tempLow = found[0].tempLow
                    var text = ''
                    
                    if (newEntry.temp > tempHigh || newEntry.temp < tempLow || newEntry.rh > rhHigh || newEntry.rh < rhLow) {
                        console.log("Temp/RH out of range")
                        text = `
                        Dear user,
                        
                        Gaia has detected that the local temperature and/or humidity is out of your specified range.
                        
                        Your range: ${tempLow} - ${tempHigh} °C
                        Current temp: ${newEntry.temp} °C

                        Your range: ${rhLow} - ${rhHigh} %
                        Current humidity: ${newEntry.rh} %
                        
                        Thank you for using Gaia.`
                    }

                    var mailOptions = {
                        from: 'gaiaprojectapp@gmail.com',
                        to: email,
                        subject: 'Gaia: Out of Range',
                        text: text
                    }

                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            console.log(error)
                        } else {
                            console.log(`Email sent: ${info.response}`)
                        }
                    })
                }
            })
        }
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

app.post('/user', function(req, res) {
    console.log('USER')
    console.log(req.body)
    db.emails.find(function(error, found) {
        if (error) {
            console.log(error)
        } else {
            if (found) {
                db.emails.update(
                    {email: {$exists: true}}, 
                    {$set: {
                        email: req.body.email,
                        tempLow: req.body.tempLow,
                        tempHigh: req.body.tempHigh,
                        rhLow: req.body.rhLow,
                        rhHigh: req.body.rhHigh
                    }},
                    function(err, updated) {
                        if (err || !updated){
                            console.log(err)
                        } else {
                            console.log(updated)
                        }
                    }
                )
            }
        }
    })
})

app.listen(PORT, function() {
    console.log(`App running on port ${PORT}!`)
    // sample new sensor data every 15 minutes and post it to db by calling /post route
    setInterval(function() {
        request(app)
            .get('/post')
            .end(function(err, res) {
                if (err) {
                    console.log(err)
                } 
        })
    }, 900000)
})