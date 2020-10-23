const express = require('express');
const ImageRouter = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require("fs")

const ChatImages = require('../../model/images');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null,  fileName)
  }
});


var upload = multer({

  storage: storage,
  limits: {
        fileSize: 5 * 1024 * 1024,
      },
  fileFilter: (req, file, cb) => {
    console.log('File', file)
    cb(null, true);
    // if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "video/mp4") {
    //   cb(null, true);
    // } else {
    //   cb(null, false);
    //   return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    // }
  }
}).single('file');


ImageRouter.post('/uploadFile',upload, (req, res, next) => {

  const url = req.protocol + '://' + req.hostname + ":3000"

  const newImage = new ChatImages({

    img: url + '/uploads/' + req.file.filename
  });
  newImage.save()
    .then((result => {
      console.log(result);
      res.status(200).json(result)

    })).catch((err) => next(err))
})

ImageRouter.get('/getImages', (req, res) => {

  const query = ChatImages.find({});
  query.exec().then(data => {
    if (data.length === 0) {
      res.json([]);
    } else {
      res.json(data);
    }
  })
  })


  module.exports = ImageRouter;