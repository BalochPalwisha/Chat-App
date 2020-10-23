const express = require("express");
const router = express.Router();



const chatUsers = require("../../model/chatUsers");
const Chat = require("../../model/Chats")

router.post('/insertUsers', (req, res) => {

    const newUser = new chatUsers({
        name: req.body.name,
        userId: req.body.userId

    });
    newUser
        .save()
        .then(user => res.json(user))
        .catch(err => console.log(err));

});

router.get('/getUsers', (req, res) => {

const users = chatUsers.find({});
users.exec().then(data => {
  if (data.length === 0) {
    res.json([]);
  } else {
    res.json(data);
  }
});
})

//Chatrooms getter API
router.get("/chats/:userId", (req, res) => {
    const chat = Chat.find({
      $or: [{ reciever: req.params.userId }, { sender: req.params.userId }]
    });
  
    chat.exec().then(data => {
      if (data.length === 0) {
        res.json([]);
      } else {
        res.json(data);
      }
    });
  });
//Chat messages getter API
router.get("/chats/:sender/:reciever", (req, res) => {
    const chat = Chat.findOne({
      $or: [
        { reciever: req.params.reciever, sender: req.params.sender },
        { reciever: req.params.sender, sender: req.params.reciever }
      ]
    });

 
  
    chat.exec().then(data => {

      if (data === null) {
        res.json([]);
      } else {
        res.json(data.messages);
      }
    });
  });


 //New chat message API
router.post("/chats", (req, res) => {
      
    const query = Chat.findOne({
      $or: [
        { reciever: req.body.reciever, sender: req.body.sender },
        { reciever: req.body.sender, sender: req.body.reciever }
      ]
    });
    //console.log(query)
    query
      .exec()
      .then(data => {
         if (data === null) {
          const chat = new Chat({
            sender: req.body.sender,
            reciever: req.body.reciever,
            messages: req.body.messages
          });
  
          chat
            .save()
            .then(data => {
              res.json(data);
            })
            .catch(error => {
              res.json(error);
            });
         } 
        else {
          
          let msgs = data.messages
          for(let i = 0; i < msgs.length; i++){
            //console.log('IIII', msgs[i])
          
          }
          msgs.unshift(req.body.messages)
          const updateChat = Chat.updateOne(
            
            {
              $or: [
                { reciever: req.body.reciever, sender: req.body.sender },
                { reciever: req.body.sender, sender: req.body.reciever }
              ]
            },
            { $set: { messages: msgs } }
          );
          updateChat
          .exec()
          .then(data => {
            res.json(data);
          })
          .catch(error => {
            res.json(error);
          });
         
        }
      })
  }); 

//User finder API
router.get("/find/:id", (req, res) => {
  const user = chatUsers.find({ userId: req.params.id });
  //console.log("query",user)
  user.exec().then(data => {
    //console.log('data:',data )
    res.json(data[0]);
  });
});



module.exports = router;

