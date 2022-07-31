var express = require('express');

var app = express();

var port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var checkAuth = require('./middleware/check-auth');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Content-Type", "application/json");
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.post('/',function(req, res){
    if(req.body.username && req.body.password){
        var token = jwt.sign({
            username: req.body.username,
            password: req.body.password
        }, process.env.JWT_KEY,
        {
            expiresIn: "1h"
        }
        );
        res.json({token: token});
    }else{
        res.send('Something is wrong');
    }
    
});

app.get('/test',checkAuth, function(req, res){
    res.send('Welcome to node js');
})

app.listen(port, function(){
    console.log('Server is running');
}); 