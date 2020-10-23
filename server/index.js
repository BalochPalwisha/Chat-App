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
var path = require('path');

const Users = require("./routes/api/users");
const ChatUsers = require("./routes/api/chatUsers");
const Images = require('./routes/api/images');
const DownloadImage  = require("./routes/api/DownloadImage");
const CUser = require('./model/chatUsers');



const PORT = process.env.PORT || 3000;
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


// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

app.use(express.static(path.join(__dirname, './server/public/')));




// Routes
app.use("/api/users", Users);
app.use("/api/chatUsers", ChatUsers);
app.use("/api/images", Images);
app.use('/uploads', require('./routes/api/DownloadImage'));


/** Socket Declarations */

var clients = []; //connected clients

websocket.on("connection", socket => {
   console.log("New User Connected");
  socket.on("storeClientInfo", (data) => connectedUser(data, socket));
  //when user disconnected
  socket.on("Disconnecting", (data) => disConnectUsers(data, socket));

  // when get new message
  socket.on("newMessage", data => {
    //Notify the room
    console.log('message recived!')
    socket.broadcast.emit("incommingMessage", "reload");
    console.log('message send!')
  });
});

const connectedUser = (data, socket) => {

  console.log(data.currentUserId + " Connected");

  //store the new client
  // var clientInfo = new Object();
  // clientInfo.customId = data.customId;
  // clientInfo.clientId = socket.id;
  // clients.push(clientInfo);

  //update the active status
  const res = CUser.updateOne({ userId: data.currentUserId }, { isActive: true });
  res.exec().then(res => {
    //console.log(res)
    console.log("Activated " + data.currentUserId);

    //Notify others
    socket.broadcast.emit("update", "Updated");
    console.log("emmited");
  });

}

const disConnectUsers = (data, socket) => {
  console.log('dissss', data.currentUserId)
  let currentId = data.currentUserId


  //update the active status
  const res = CUser.updateOne({ userId: data.currentUserId }, { isActive: false });
  res.exec().then(data => {
    console.log("Deactivated " + currentId);

    //notify others
    socket.broadcast.emit("update", "Updated");
  });

}

// socket.on("disconnect", function (data) {

//   console.log('its working')


//   for (var i = 0, len = clients.length; i < len; ++i) {
//     var c = clients[i];

//     console.log('ccc:', c + "anddddd" + socket.id)

//     if (c.clientId == socket.id) {
//       //remove the client
//       clients.splice(i, 1);
//       console.log(c.customId + " Disconnected");

//       //update the active status
//       const res = CUser.updateOne({ id: c.customId }, { isActive: false });
//       res.exec().then(data => {
//         console.log("Deactivated " + c.customId);

//         //notify others
//         socket.broadcast.emit("update", "Updated");
//       });
//       break;
//     }
//   }
// });


server.listen(PORT, () => console.log("server running on port:" + PORT));