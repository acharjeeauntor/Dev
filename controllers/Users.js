const gravatar = require("gravatar");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = require("../config/keys").secretOrKey;

// Load Input Validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

//User model
const User = require("../models/User");




//For User Registration
exports.RegisterUser = (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }



  const { name, password, email } = req.body;
  const avatar = gravatar.url(email, {
    s: "200", //size
    r: "pg", //rating
    d: "mm" //default
  });

  User.findOne({ email })
    .then((user) => {
      if (user) {
        errors.email="Email already Exists"
        return res.status(400).json(errors);
      } else {
        bcrypt
          .hash(password, 10)
          .then((hashPassword) => {
            const newUser = new User({
              name,
              email,
              avatar,
              password: hashPassword
            });
            newUser
              .save()
              .then((user) => res.json(user))
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
};

//For User Login
exports.LoginUser = (req, res) => {
  const {errors,isValid} = validateLoginInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }
  
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      //check user
      if (!user) {
        errors.email = "User not found"
        return res.status(404).json(errors);
      }
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          //check password
          if (isMatch) {
            //jwt payload
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            };
            //sign token
            jwt.sign(payload, secret, { expiresIn: 3600 }, (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            });
          } else {
            errors.password = "Password incorrect"
            return res.status(400).json(errors);
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};



//for current user login
exports.LoginCurrentUser = (req, res) => {
  const { name, id, email } = req.user;
  res.json({
    id,
    name,
    email
  });
};

