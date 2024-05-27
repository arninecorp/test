var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mynotes.db');


db.serialize(function() {

  db.run("CREATE TABLE if not exists user (id INTEGER PRIMARY KEY,name TEXT)");
  db.run("CREATE TABLE if not exists notes (id INTEGER PRIMARY KEY,content TEXT, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES user(id))");

  var stmt = db.prepare("INSERT INTO user (name) VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Name1" + i);
  }
  stmt.finalize();

  var stmt = db.prepare("INSERT INTO notes (content, user_id) VALUES (?,?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Note Content " + i, i+1);
  }
  stmt.finalize();
  
});

function isCurrentUser(user_id) {
	
	...
	// Verify that the current session belongs to the user specified as argument
	// Return 'true' -> if current_session == user_id
	// Return 'false' -> if current_session != user_id
	...
}

app.get('/account/:user/:note', function(req, res) {
    var user = req.params.user;
    var note = req.params.note;

    if(!isCurrentUser(user)){
    	res.end("Unauthorized!!!\n");
    }

    var search = db.get("SELECT * FROM notes where id = (?)", note, function(err, row) {
	      console.log(row);
	      console.log(err);
	      res.send(row);
	  	});
});

app.listen(8081,function(){
  console.log("Started on PORT 8081");
});
Source Code Challenges








