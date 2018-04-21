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

router.post('/login', (req, res, next) => {
   console.log(req.body);
   pool.getConnection((err, con) => {
       var sql = "select * from Users where email = " + mysql.escape(req.body.username) +
           " and password = " + mysql.escape(req.body.password);

       con.query(sql, (err, result) => {
           con.release();
           if(err) {
               console.log(err);
                res.json({message: "Error in querying DB in login"})
           } else {
               if(result.length > 0) {
                   console.log("User found...", result);
                   req.session.username = result[0].username;
                   console.log("Session Started...", req.session.username );
                   res.json({
                       message: "success",
                       result: result[0],
                       sessionUsername: req.session.username
                   })
               } else {
                   res.json({
                       message: "Error..User not found"
                   })
               }
           }
       })

   })
});

router.get('/checksession', (req, res) => {
    console.log("In checksession...",req.session.username);
    if(req.session.username) {
        res.json({sessionUsername: req.session.username});
    }

    else
        res.json({sessionUsername: "ERROR"});
});

router.post('/logout', (req, res) => {
    console.log('Logging out...', req.session.username);
    req.session.destroy();
    res.json({"result": "Session destoryed..please login"});
});


module.exports = router;
