// index.js
var express = require("express");  
var bodyParser = require("body-parser");  
var jwt = require("jwt-simple");  
var auth = require("./auth.js")();  
var users = require("./users.js");  
var cfg = require("./config.js");  
var app = express();
var cors = require('cors');

app.use(bodyParser.json());  
app.use(auth.initialize());
app.use(cors());

app.get("/", function(req, res) {  
    res.json({
        status: "My API is alive!"
    });
});

app.get("/user", auth.authenticate(), function(req, res) {  
    let user = users.find(u => u.id == req.user.id);
    let obj = Object.assign({}, {id: user.id, name: user.name, email: user.email})
    res.json(obj);
});

app.post("/token", function(req, res) {      
    if (req.body.email && req.body.password) {
        var email = req.body.email;
        var password = req.body.password;
        var user = users.find(function(u) {
            return u.email === email && u.password === password;
        });
        if (user) {
            var payload = {
                id: user.id
            };
            var token = jwt.encode(payload, cfg.jwtSecret);
            res.json({
                token: token
            });
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
});

app.listen(3000, function() {  
    console.log("My API is running...");
});

module.exports = app;  