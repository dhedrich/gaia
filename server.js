var express = require('express')
var bodyParser = require('body-parser')


// initialize express
var app = express()
var PORT = 3000

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }))

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"))
app.use(bodyParser.json())


// render homepage
app.get('/name', function (req, res) {
    // Use child_process.spawn method from 
    // child_process module and assign it
    // to variable spawn
    var spawn = require("child_process").spawn;

    // Parameters passed in spawn -
    // 1. type_of_script
    // 2. list containing Path of the script
    //    and arguments for the script 

    // E.g : http://localhost:3000/name?firstname=Mike&lastname=Will
    // so, first name = Mike and last name = Will
    var process = spawn('python', ["./hello.py",
        req.query.firstname,
        req.query.lastname]);

    // Takes stdout data from script which executed
    // with arguments and send this data to res object
    process.stdout.on('data', function (data) {
        res.send(data.toString());
    })
})

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!")
})
