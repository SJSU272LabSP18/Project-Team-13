var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var multer = require('multer');


var pool  = mysql.createPool({
    connectionLimit : 30,
    host     : 'weserveinstance.ccecdywbwqqr.us-west-1.rds.amazonaws.com',
    port     : 3305,
    user     : 'root',
    password : 'rootroot',
    database : 'weserve'
});

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './images/');
    },
    filename: function(req, file, cb ){
        cb(null, req.body.userid + '.jpg');
    }
});

const upload = multer({storage});


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

            var checkUsername = 'select username from Users where username = ' + mysql.escape(req.body.username);
            connection.query(checkUsername, (err, result) => {
                if(err) {
                    console.log("Error in checking username", err);
                    res.json({"message": "Error checking username in Database"});
                } else {
                    if(result.length > 0) {
                        console.log("In inserting user ", result);
                        res.json({"message": "Username already exists, please try another"});
                    } else {
                        var query = "insert into Users (userType, username, password, email) values (" + mysql.escape(req.body.usertype) +
                            ", " + mysql.escape(req.body.username) + ", " + mysql.escape(req.body.password) + ", " + mysql.escape(req.body.email) + ")";
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
                }
            })
        }
    })
});

router.post('/login', (req, res, next) => {
   console.log(req.body);
   pool.getConnection((err, con) => {
       var sql = "select * from Users where username = " + mysql.escape(req.body.username) +
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
                   req.session.userID = result[0].userID;
                   req.session.usertype = result[0].userType;
                   console.log("Session Started...", req.session.username );
                   res.json({
                       message: "success",
                       result: result[0],
                       sessionUsername: req.session.username,
                       sessionUserID: req.session.userID
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
        res.json({
            sessionUsername: req.session.username, 
            sessionUserID: req.session.userID,
            usertype: req.session.usertype
        });
    }

    else
        res.json({sessionUsername: "ERROR"});
});

router.post('/logout', (req, res) => {
    console.log('Logging out...', req.session.username);
    req.session.destroy();
    res.json({"result": "Session destoryed..please login"});
});

router.get('/get_all_posted_projects', (req, res) => {
   console.log("In get_all_posted_projects", req.body);
   pool.getConnection((err, con) => {
       var sql = 'select * from projectsNew;'
       con.query(sql, null, (err, result) => {
           con.release();

           if(err) {
               console.log("Error in querying the db for getting projects");
               res.json({message: "Error in querying the db for getting projects"});
           } else {
               if(result.length > 0) {
                   console.log("After getting all projects...", result);
                   res.json({
                       message: 'success',
                       result: result
                   })
               }
           }
       })
   })
});

router.post('/getspecificproject', (req, res) => {
   console.log("In get specific project...");
    pool.getConnection((err, con) => {
        var sql = 'select * from projectsNew where id = ' + mysql.escape(req.body.projectID);
        con.query(sql, null, (err, result) => {
            con.release();

            if(err) {
                console.log("Error in querying the db for getting projects");
                res.json({message: "Error in querying the db for getting projects"});
            } else {
                if(result.length > 0) {
                    console.log("After getting specific projects...", result);
                    res.json({
                        message: 'success',
                        result: result
                    })
                }
            }
        })
    })
});

router.post('/getmultipleprojects', (req, res) => {
    console.log("In get multiple projects...");
    console.log(req.body)

    pool.getConnection((err, con) => {
        var sql = 'select * from projectsNew where id in (' + req.body.projectIDs + ')';
        console.log(sql)
        con.query(sql, null, (err, result) => {
            con.release();

            if(err) {
                console.log("Error in querying the db for getting multiple projects");
                res.json({message: "Error in querying the db for getting multiple projects"});
            } else {
                if(result.length > 0) {
                    console.log("After getting multiple projects...", result);
                    res.json({
                        message: 'success',
                        result: result
                    })
                }
            }
        })
    })
});

router.post('/getmultipleusers', (req, res) => {
    console.log("In get multiple users...");
    console.log(req.body)

    pool.getConnection((err, con) => {
        var sql = 'select * from Users where userID in (' + req.body.userIDs + ')';
        console.log(sql)
        con.query(sql, null, (err, result) => {
            con.release();

            if(err) {
                console.log("Error in querying the db for getting users");
                res.json({message: "Error in querying the db for getting users"});
            } else {
                if(result.length > 0) {
                    console.log("After getting multiple users...", result);
                    res.json({
                        message: 'success',
                        result: result
                    })
                }
            }
        })
    })
});


router.post('/saveVolunteerForProject', (req, res) => {
    console.log("In saveVolunteerForProject", req.body);
    var userid = req.body.userid;
    var projectid = req.body.projectid;
    pool.getConnection((err, con) => {
        if(err) {
            console.log("Error connecting to mysql in saveVolunteerForProject");
            res.json({
                message: "Error connecting to mysql in saveVolunteerForProject"
            })
        } else {

            var sql1 = "select * from Hired_Users_Projects where userid = ? and projectid = ?";
            con.query(sql1, [userid, projectid], (err, result) => {
                if(err) {
                    console.log("Error in querying the db for inserting volunteer for the projects", err);
                    res.json({message: "Error in querying the db for inserting volunteer for the projects"});
                } else {
                    if(result.length == 0) {
                        var sql = "insert into Hired_Users_Projects (userid, projectid) values (?, ?)";
                        con.query(sql, [userid, projectid], (err, result1) => {
                            con.release();
                            if(err) {
                                console.log("Error in querying the db for inserting volunteer for the projects", err);
                                res.json({message: "Error in querying the db for inserting volunteer for the projects"});
                            } else {
                                console.log("Volunteer inserted successfully", result1);
                                res.json({
                                    message: "Volunteer Hired"
                                })
                            }
                        })
                    } else {
                        if(result.length > 0) {
                            console.log("The same user is already hired");
                            res.json({
                                message: "This volunteer is already hired, check current volunteers above"
                            })
                        }
                    }
                }
            })


        }
    })
});


router.post('/getAllVolunteersForProject', (req, res) => {
    console.log("In getAllVolunteersForProject", req.body);
    var projectid = req.body.projectid;
    pool.getConnection((err, con) => {
        if(err) {
            console.log("Error connecting to mysql in getAllVolunteersForProject");
            res.json({
                message: "Error connecting to mysql in getAllVolunteersForProject"
            })
        } else {
            var sql = "select * from Users as u inner join Hired_Users_Projects as hup on u.userID = hup.userid where hup.projectid = ?";
            con.query(sql, [projectid], (err, result) => {
                con.release();
                if(err) {
                    console.log("Error in querying the db for getAllVolunteersForProject", err);
                    res.json({message: "Error in querying the db for getting volunteer for the projects"});
                } else {
                    if(result.length > 0) {
                        console.log("Got all hired volunteers successfully");
                        res.json({
                            message: "Got all hired volunteers successfully",
                            result: result
                        })
                    } else {
                        console.log("No hired volunteers yet");
                        res.json({
                            message: "No hired volunteers yet",
                            result: []
                        })
                    }

                }
            })
        }
    })
});

router.get('/getNGOPostedProjects/:ngoid', (req, res) => {
    console.log("Printing in getNGOPostedProjects", req.params);
    var ngoid = req.params.ngoid;
    pool.getConnection((err, con) => {
        if(err) {
            console.log("Error connecting to mysql in getNGOPostedProjects");
            res.json({
                message: "Error connecting to mysql in getNGOPostedProjects"
            })
        } else {
            var sql = "select * from projectsNew where ngoUserId = ?";
            con.query(sql, ngoid, (err, result) => {
                con.release();
                if(err) {
                    console.log("Error in querying the db for getNGOPostedProjects", err);
                    res.json({message: "Error in querying the db for getting projects for NGOs"});
                } else {
                    if(result.length > 0) {
                        console.log("Got all posted projects successfully");
                        res.json({
                            message: "Got all posted projects successfully",
                            result: result
                        })
                    } else {
                        console.log("No projects posted yet");
                        res.json({
                            message: "No projects posted yet",
                            result: []
                        })
                    }

                }
            })
        }
    })
});


router.get('/getCurrentWorkingProjects/:userid', (req, res) => {
    console.log("Printing in getCurrentWorkingProjects", req.params);
    var userid = req.params.userid;
    pool.getConnection((err, con) => {
        if(err) {
            console.log("Error connecting to mysql in getCurrentWorkingProjects");
            res.json({
                message: "Error connecting to mysql in getCurrentWorkingProjects"
            })
        } else {
            var sql = "select * from projectsNew as pn inner join" +
                " (select hup.projectid as hupprojectid from Hired_Users_Projects as hup inner join" +
                " Users as u on u.userID = hup.userid where hup.userid = ?) as t" +
                " on pn.id = t.hupprojectid";

            con.query(sql, userid, (err, result) => {
                con.release();
                if(err) {
                    console.log("Error in querying the db for getCurrentWorkingProjects", err);
                    res.json({message: "Error in querying the db for getting current working projects for users"});
                } else {
                    if(result.length > 0) {
                        console.log("Got all current working projects successfully");
                        res.json({
                            message: "Got all current working projects successfully",
                            result: result
                        })
                    } else {
                        console.log("No current working projects");
                        res.json({
                            message: "No current working projects",
                            result: []
                        })
                    }

                }
            })
        }
    })
});

router.post('/profile', (req, res, next) =>{
    console.log(req.body);
var body = req.body;
let dobj = [];
if(body.firstname) dobj.push("firstname = " + mysql.escape(body.firstname));
if(body.lastname) dobj.push("lastname = " + mysql.escape(body.lastname));
if(body.email) dobj.push("email = " + mysql.escape(body.email));
if(body.image) dobj.push("image = " + mysql.escape(body.image));
if(body.description) dobj.push("description = " + mysql.escape(body.description));
if(body.region) dobj.push("region = " + mysql.escape(body.region));
console.log(JSON.stringify(dobj));
var updateStr = "";
for(var i=0; i<dobj.length-1; i++){
    updateStr = updateStr + dobj[i] + ",";
}
updateStr += dobj[dobj.length-1];

pool.getConnection((err, connection) => {
    if(err){
        console.log("Error connecting to database");
        res.json({"message": "Error connecting to database"});
    }else{
        console.log('connected to MYSQL');
var query = "update Users set " + updateStr + "where username = " + mysql.escape(req.session.username) + ";";
connection.query(query, (err, results) =>{
    connection.release();
if(err){
    console.log(query,"error in updating user info");
    res.json({"message": "Error updating user in database"});
} else {
    console.log("In updating users", results);
    res.json({"message":"success"})
}
})
}
})
});

router.post('/upload',  upload.single('file'), (req,res, next) =>{
    console.log("profile image uploaded");
});

router.post('/get_user_info', (req, res, next) => {
    console.log(' request to get user profile ', req.body.userid);
pool.getConnection((err, conn) => {
    if(err) {
        console.log("Error connecting to database");
        res.json({"message": "Error connecting to database"});
    }else{
        console.log('connected to MYSQL');
var sql = "select * from Users where userID = " + mysql.escape(req.body.userid) + ";";
console.log(sql);
conn.query(sql, (err, results) => {
    conn.release();
if (err) {
    console.log("Error in querying the db for getting user");
    res.json({message: "Error in querying the db for getting user"});
} else {
    if (results.length > 0) {
        console.log("after getting user info", results);
        res.json({
            message: 'success',
            result: results
        })
    }
}
})
}
})
})

router.post('/get_logged_user_info', (req, res, next) => {
    console.log(' request to get user profile ', req.body.userid);
pool.getConnection((err, conn) => {
    if(err) {
        console.log("Error connecting to database");
        res.json({"message": "Error connecting to database"});
    }else{
        console.log('connected to MYSQL');
var sql = "select * from Users where username = " + mysql.escape(req.body.userid) + ";";
console.log(sql);
conn.query(sql, (err, results) => {
    conn.release();
if (err) {
    console.log("Error in querying the db for getting logged user");
    res.json({message: "Error in querying the db for getting logged user"});
} else {
    if (results.length > 0) {
        console.log("after getting logged user info", results);
        res.json({
            message: 'success',
            result: results
        })
    }
}
})
}
})
})


router.post('/postproject', (req, res, next) => {
    console.log(req.body);
var body = req.body;
pool.getConnection((err, connection) => {
    if(err){
        console.log("Error Connecting to Database");
        res.json({"message": "Error Connecting to Database"});
    } else {
        var query = "insert into projectsNew (ngoUserId, ngoName, region, imageUrl, name, scope, need, beneficiaries, funding, contact) values ("
            +mysql.escape(body.ngoUserId) + ", " + mysql.escape(body.ngoName) + ", " + mysql.escape(body.region) + ", " + mysql.escape(body.image) + ", "
            + mysql.escape(body.name) + ", " + mysql.escape(body.scope) + ", " + mysql.escape(body.need) + ", "
            + mysql.escape(body.beneficiaries) + ", " + mysql.escape(body.funding) + ", " + mysql.escape(body.contact) + ")";
connection.query(query, (err, results) => {
    connection.release();
if(err) {
    console.log("Error in inserting project", err);
    res.json({"message": "Error posting project in Database"});
} else {
    console.log("In inserting project ", results);
    res.json({"message": "Project posted Successfully"});
}
})
}
})
})

router.post('/saveInterested', (req, res) => {
    console.log("In saveInterested", req.body);
    var userid = req.body.userid;
    var projectid = req.body.projectid;
    pool.getConnection((err, con) => {
        if(err) {
            console.log("Error connecting to mysql in saveInterested");
            res.json({
                message: "Error connecting to mysql in saveInterested"
            })
        } else {

            var sql1 = "select * from Interested_Users_Projects where userid = ? and projectid = ?";
            con.query(sql1, [userid, projectid], (err, result) => {
                if(err) {
                    console.log("Error in querying the db for saveInterested", err);
                    res.json({message: "Error in querying the db for saveInterested"});
                } else {
                    if(result.length == 0) {
                        var sql = "insert into Interested_Users_Projects (userid, projectid) values (?, ?)";
                        con.query(sql, [userid, projectid], (err, result1) => {
                            con.release();
                            if(err) {
                                console.log("Error in querying the db for saveInterested", err);
                                res.json({message: "Error in querying the db for saveInterested"});
                            } else {
                                console.log("Interested Volunteer inserted successfully", result1);
                                res.json({
                                    message: "Added as Interested"
                                })
                            }
                        })
                    } else {
                        if(result.length > 0) {
                            console.log("The same user is already interested");
                            res.json({
                                message: "You are already interested"
                            })
                        }
                    }
                }
            })


        }
    })
});

router.post('/getAllInterestedUsers', (req, res) => {
    console.log("In getAllInterestedUsers", req.body);
    var projectid = req.body.projectid;
    pool.getConnection((err, con) => {
        if(err) {
            console.log("Error connecting to mysql in getAllInterested");
            res.json({
                message: "Error connecting to mysql in getAllInterested"
            })
        } else {
            var sql = "select * from Users as u inner join Interested_Users_Projects as iup on u.userID = iup.userid where iup.projectid = ?";
            con.query(sql, [projectid], (err, result) => {
                con.release();
                if(err) {
                    console.log("Error in querying the db for getAllInterestedUsers", err);
                    res.json({message: "Error in querying the db for getAllInterestedUsers"});
                } else {
                    if(result.length > 0) {
                        console.log("Got all interested volunteers successfully");
                        res.json({
                            message: "Got all interested volunteers successfully",
                            result: result
                        })
                    } else {
                        console.log("No interested volunteers yet");
                        res.json({
                            message: "No interested volunteers yet",
                            result: []
                        })
                    }

                }
            })
        }
    })
});

router.post('/getAllInterestedProjects', (req, res) => {
    console.log("In getAllInterestedProjects", req.body);
    var userid = req.body.userid;
    pool.getConnection((err, con) => {
        if(err) {
            console.log("Error connecting to mysql in getAllInterested");
            res.json({
                message: "Error connecting to mysql in getAllInterested"
            })
        } else {
            var sql = "select * from projectsNew as p inner join Interested_Users_Projects as iup on p.id = iup.projectid where iup.userid = ?";
            con.query(sql, [userid], (err, result) => {
                con.release();
                if(err) {
                    console.log("Error in querying the db for getAllInterestedProjects", err);
                    res.json({message: "Error in querying the db for getAllInterestedProjects"});
                } else {
                    if(result.length > 0) {
                        console.log("Got all interested projects successfully", result);
                        res.json({
                            message: "Got all interested projects successfully",
                            result: result
                        })
                    } else {
                        console.log("No interested projects yet");
                        res.json({
                            message: "No interested projects yet",
                            result: []
                        })
                    }

                }
            })
        }
    })
});



module.exports = router;
