var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool  = mysql.createPool({
    connectionLimit : 10,
    host     : 'weserveinstance.ccecdywbwqqr.us-west-1.rds.amazonaws.com',
    port     : 3305,
    user     : 'root',
    password : 'rootroot',
    database : 'weserve'
});



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', (req, res, next) => {

    console.log(req.body);


    pool.getConnection((err, connection) => {
        if(err) {
            console.log("Error Connecting to Database");
            res.json({"message": "Error Connecting to Database"});
        } else {
            console.log("Connected to MySQL...");
            var query = "insert into users (id, username, password) values (" + mysql.escape(req.body.id) +
                ", " + mysql.escape(req.body.username) + ", " + mysql.escape(req.body.password) + ")";
            connection.query(query, (err, results) => {
                connection.release();
                if(err) {
                    console.log("Error in inserting user", err);
                    res.json({"message": "Error Creating User in Database"});
                } else {
                    console.log("In inserting user ", results);
                    res.json({"message": "User Created Successfully"});
                }
            })
        }
    })
});


module.exports = router;
