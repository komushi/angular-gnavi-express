var application_root = __dirname;
var express = require("express");
var path = require("path");
var app = express();


// Config
app.use(express.static(path.join(application_root, "/app")));

app.get('/api', function (req, res) {
   res.send('Ecomm API is running');
});
app.listen(process.env.PORT || 9000);

// app.get('/getangularusers', function (req, res) {
//   res.header("Access-Control-Allow-Origin", "http://localhost");
//   res.header("Access-Control-Allow-Methods", "GET, POST");
//   db.things.find('', function(err, users) {
//     if( err || !users) 
//     {
//       console.log("No users found");
//     }
//     else 
//     {
//       res.writeHead(200, {'Content-Type': 'application/json'});
//       str='[';
//       users.forEach( function(user) {
//         str = str + '{ "name" : "' + user.username + '"},' +'\n';
//       });
//       str = str.trim();
//       str = str.substring(0,str.length-1);
//       str = str + ']';
//       res.end( str);
//     }
//   });
// });

// app.post('/insertangularmongouser', function (req, res){
//   console.log("POST: ");
//   res.header("Access-Control-Allow-Origin", "http://localhost");
//   res.header("Access-Control-Allow-Methods", "GET, POST");
//   //res.writeHead(200, {'Content-Type': 'text/plain'});
//   //user = req.body.username;
//   //passwd = req.body.password;
//   //emailid = req.body.email;
//   console.log(req.body);
//   console.log(req.body.mydata);
//   var jsonData = JSON.parse(req.body.mydata);
//   console.log(jsonData.username);
//   console.log(jsonData.password);
//   console.log(jsonData.email);

//   db.things.save({email: jsonData.email, password: jsonData.password, username: jsonData.username}, function(err, saved) {
//     if( err || !saved ) res.end( "User not saved"); 
//       else res.end( "User saved");
//   });
// });

// app.listen(1212);