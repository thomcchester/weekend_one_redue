var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');

var connectionString;

if(process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/employees';
}

router.post("/people", function(req,res){
  //not exactly sure what this will do
  console.log("Attempting to post to people DB");
  console.log(req.body);
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log("not writing to db");
      res.status(500).send(err);
    }else{
      var result = [];

      var query = client.query('INSERT INTO people (first_name, last_name, employee_id,job_title,salary,active) VALUES ($1, $2, $3, $4, $5,$6) '+ 'RETURNING id, first_name, last_name, employee_id,job_title, salary', [req.body.first_name, req.body.last_name, req.body.employee_id, req.body.job_title, req.body.salary, req.body.active]);
      query.on('row', function(row){
        result.push(row);
        done();
      });
      query.on('error', function(err){
        done();
        console.log('Error running query: ' , err);
        res.status(500).send(err);
      });
      query.on('end', function(end){
        done();
        res.send(result);
      });
    }
  });
});

router.get("/oldPeople", function(req,res){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log("not writing to db");
      res.status(500).send(err);
    }else{
      var result = [];

      var query = client.query('SELECT * FROM PEOPLE');
      query.on('row', function(row){
        result.push(row);
        done();
      });
      query.on('error', function(err){
        done();
        console.log('Error running query: ' , err);
        res.status(500).send(err);
      });
      query.on('end', function(end){
        done();
        res.send(result);
      });
    }
  });
});

module.exports = router;
