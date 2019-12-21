/*

-- install npm package 
npm install --save express
npm install --save mysql
npm install --save body-parser
npm install --save cors

-- create database in AWS RDS
-- connect using MYSQL Workbatch and run the following queries 
create database school;



use school;


drop table school.student;



CREATE TABLE school.student 
(
    id int NOT NULL AUTO_INCREMENT,

    firstName varchar(255) NOT NULL,

    lastName varchar(255),

    PRIMARY KEY (id)

);



insert into school.student (firstname, lastname) values ('tom', 'patel');

insert into school.student (firstname, lastname) values ('mike', 'smith');



select * from student


*/


var express = require('express');
var app = express();
var fs = require("fs");
const bodyParser = require('body-parser');
const mysql = require('mysql')



const options = {
host     : "itexpsdb.cvoybteajofl.us-east-1.rds.amazonaws.com",
user     : "admin",
password : "itexps123",
database: 'school'
}

const connection = mysql.createConnection(options)

connection.connect(function(err) {
 if (err) throw err;
 console.log("Connected!");
 });

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(function(req, res, next) {
 res.header("content-type", "application/json");
 res.header("Access-Control-Allow-Origin", "*");
 res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");   
 next();
});

app.get('/students', function (req, res) {   
 connection.query("SELECT * FROM  `school`.`student` ", function (err, result, fields) {
 if (err) throw err;
 res.end(JSON.stringify(result));
    });
})


app.post('/students', function (req, res) {   
 var firstname = req.body.firstName;
 var lastname = req.body.lastName;

 console.log ("post");
 console.log(req.body);

 connection.query("INSERT INTO `school`.`student` (`firstname`, `lastname`) VALUES ('"+firstname+"', '"+lastname+"'); ", function (err, result, fields) {
 if (err) throw err;
 res.end(JSON.stringify(result));
    });
})

app.get('/students/:studentId', function (req, res) {
 connection.query("SELECT * FROM `school`.`student` where id = " + req.params.studentId, function (err, result, fields) {
 if (err) throw err;
 res.end(JSON.stringify(result));
    });
})

app.put('/students/:studentId', function (req, res) {
 console.log ("put");
 console.log(req.body);

 connection.query("UPDATE  `school`.`student` set firstname = '"+req.body.firstName+ "' , lastname ='" +req.body.lastName + "' where id = " + req.params.studentId, function (err, result, fields) {
 if (err) throw err;
 res.end(JSON.stringify(result));
    });
})

app.delete('/students/:studentId', function (req, res) {
 connection.query("DELETE FROM  `school`.`student`  WHERE id = " + req.params.studentId, function (err, result, fields) {
 if (err) throw err;
 res.end(JSON.stringify(result));
    });
})


app.post('/addStudent', function (req, res) {
 // First read existing users.
 res.end( JSON.stringify(req.body));
})

var server = app.listen(9000, function () {
 var host = server.address().address
 var port = server.address().port
 console.log("Example app listening at http://%s:%s", host, port)
})
