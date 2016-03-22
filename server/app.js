var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var pg = require('pg');
var peopleRouter = require('./routes/people.js');

var connectionString;

if(process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/employees';
}

pg.connect(connectionString, function(err, client,done){
  if (err){
    console.log('error man: ', err); //TODO so it is making some connection because this log did not show up
  } else{
    var query = client.query(

      'CREATE TABLE IF NOT EXISTS people(' +
      'id SERIAL PRIMARY KEY,' +
      'first_name varchar(15) NOT NULL,' +
      'last_name varchar(15) NOT NULL,'+
      'employee_id varchar(8) NOT NULL,'+
      'job_title varchar(80) NOT NULL,'+
      'salary varchar(12) NOT NULL,'+
      'active BOOLEAN);');

    query.on('end',function(){
      console.log('working!');
      done();
    });

    query.on('error', function(error){
      console.log(error);
      console.log('not making tables or something...');
      done();
    });
  }
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/",peopleRouter);

app.set("port",(process.env.PORT || 5000));

app.get("/*", function(req,res){
  var file = req.params[0] || "/views/index.html";
  res.sendFile(path.join(__dirname,"./public/", file));
});

app.listen(app.get("port"),function(){
  console.log("Listening on port: ", app.get("port"));
});

module.exports = app;
