const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();
require('dotenv').config()
var http = require('http')
var socketio = require('socket.io');
var server = http.Server(app);
var websocket = socketio(server);


const MongoClient = require('mongodb').MongoClient;

// const socketio = require("socket.io")
// var websocket = socketio(server);
const { reset } = require("nodemon");

const Users = require("./routes/api/users");
const ChatUsers = require("./routes/api/chatUsers");


const PORT = process.env.PORT
//const db = process.env.MONGODB_URI
const url = require("./config/key").MONGODB_URI;

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());



// Connect to MongoDB
 mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })




  var db = '';

//Use connect method to connect to the Server
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
   function(err, client) {
  //assert.equal(null, err);
  console.log('client connected')
  db = client.db("ChatApp")
  //client.close();
});



  // Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Route








app.use("/api/users", Users);
app.use("/api/chatUsers", ChatUsers);

// Mapping objects to easily map sockets and users.
var clients = {};
var users = {};


// This represents a unique chatroom.
// For this example purpose, there is only one chatroom;
var chatId = 1;

websocket.on('connection', (socket) => {
  console.log('A client just joined on', socket.id);
  clients[socket.id] = socket;

     socket.on('userJoined', (userId) => onUserJoined(userId, socket));
     socket.on('message', (message) => onMessageReceived(message, socket));
});

// Event listeners.
// When a user joins the chatroom.
function onUserJoined(userId, socket) {
  console.log('UserId:', userId)

  users[socket.id] = userId;
  _sendExistingMessages(socket);

}

// Helper functions.
// Send the pre-existing messages to the user that just joined.
function _sendExistingMessages(socket) {
  var messages = db.collection('messages')
    .find({ chatId })
    .sort({ createdAt: 1 })
    .toArray((err, messages) => {
      // If there aren't any messages, then return.
      if (!messages.length) return;
      socket.emit('message', messages.reverse());
  });
}

// When a user sends a message in the chatroom.
function onMessageReceived(message, senderSocket) {

  // console.log('###::', users)

  
  
  // var userId = users[socket.id];
  
  // // Safety check.
  // if (!userId) return;

  _sendAndSaveMessage(message, senderSocket);
}
// Save the message to the db and send all sockets but the sender.
function _sendAndSaveMessage(message, socket, fromServer) {
  var messageData = {
    text: message.text,
    user: message.user,
    createdAt: new Date(message.createdAt),
    chatId: chatId
  };

  db.collection('messages').insertOne(messageData, (err, message) => {
    // If the message is from the server, then send to everyone.
    console.log('message inserted!', message.ops[0])
    //var emitter = fromServer ? websocket : socket.broadcast;
    socket.broadcast.emit('message', message.ops[0]);
  });
}


// Allow the server to participate in the chatroom through stdin.
var stdin = process.openStdin();
stdin.addListener('data', function(d) {
  _sendAndSaveMessage({
    text: d.toString().trim(),
    createdAt: new Date(),
    user: { _id: 'robot' }
  }, null /* no socket */, true /* send from server */);
});

//Messages Socket
const chatSocket = websocket.of("/chatsocket");
chatSocket.on("connection", function(socket) {
  //On new message
  socket.on("newMessage", data => {
    //Notify the room
    socket.broadcast.emit("incommingMessage", "reload");
  });
});



  server.listen(PORT, () => console.log("server running on port:" + PORT));