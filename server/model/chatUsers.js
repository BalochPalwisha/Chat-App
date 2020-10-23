const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
const  chatUsers  =  new Schema({

    name: {
        type: String,
      },
    userId: {
        type: String
    },   
    photo:{
        type:  String,
    },
    isActive: {
    type: Boolean,
    default: false
  }
    
    });

let  ChatUsers  =  mongoose.model("chatUsers", chatUsers);
module.exports  =  ChatUsers;