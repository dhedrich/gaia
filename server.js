var express = require('express')
var bodyParser = require('body-parser')
var pythonShell = require('python-shell')


// initialize express
var app = express()
var PORT = 3000

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }))

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"))
app.use(bodyParser.json())


// render homepage
app.get('/sample', function (req, res) {
    // Use child_process.spawn method from 
    // child_process module and assign it
    // to variable spawn
    var spawn = require("child_process").spawn

    // Parameters passed in spawn -
    // 1. type_of_script
    // 2. list containing Path of the script
    //    and arguments for the script 

    // E.g : http://localhost:3000/name?firstname=Mike&lastname=Will
    // so, first name = Mike and last name = Will
    var process = spawn('python', ["./Adafruit_Python_DHT/examples/AdafruitDHT.py",
        "11",
        "4"])

    // Takes stdout data from script which executed
    // with arguments and send this data to res object
    process.stdout.on('data', function (data) {
        console.log(data.toString())
        res.send(data.toString())
    })
})

app.get('/test', function(req, res) {
    var options = {
        // designate GPIO pins to be used
        args: ["11", "4"]
    }

    pythonShell.run("./Adafruit_Python_DHT/examples/AdafruitDHT.py", options, function(err, result) {
        if (err) throw err
        console.log(result)
    })
})

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!")
})
