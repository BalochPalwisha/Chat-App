const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/key");
// Load input validation
const validateRegisterInput = require("../../validations/register");
const validateLoginInput = require("../../validations/login");
// Load User model
const User = require("../../model/Users");
const chatUsers = require("../../model/chatUsers")


router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        password2: req.body.password2
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});


router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).send(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
       
        // saving user status
        loginStatus(user);
        
 // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        };




        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {

            res.json({
              success: true,
              userId: user.id,
              userName: user.name,
              tokenBearer: token
            });

          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});


const loginStatus = (user)=> {
  const query = chatUsers.find({ userId: user.id});
  query
    .exec()
    .then(data => {
      if (data.length === 0) {
        const Chatuser = new chatUsers({
          name: user.name,
          userId: user.id,
          photo: ""
        });

        Chatuser
          .save()
          .then(data => {
           // res.json(data);
           console.log("Success",data)
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        console.log('already exist');
      }
    })
    .catch(error => {
      console.log(error);
    });

}

module.exports = router;