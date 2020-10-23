const mongoose = require("mongoose");

const ImageSchema = mongoose.Schema(
  {
    img: {
      type: String,
  },
    
  });

  let  ChatImages  =  mongoose.model("chatImages", ImageSchema);
  module.exports  =  ChatImages;