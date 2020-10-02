var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

//to display the images
app.use(express.static("public"));

// two arrays one for users and one for connections
users = [];
connections = [];

server.listen(3000);
console.log("Server running....");
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

//open a  connection with socketio
io.sockets.on("connection", function (socket) {
  connections.push(socket);
  console.log("Connected to Sockets: %s", connections.length);

  //disconnect
  socket.on("disconnect", function (data) {
    // if (!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log("Disconnected: %s sockets connected", connections.length);
  });

  //send message
  socket.on("send message", function (data) {
    io.sockets.emit("new message", { msg: data, user: socket.username });
  });

  //new user
  socket.on("new user", function (data, callback) {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  function updateUsernames() {
    io.sockets.emit("get users", users);
  }
});
