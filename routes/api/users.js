const express = require("express");
const router = express.Router();
const UserController = require("../../controllers/Users");
const passport = require("passport");


//GET  /api/users/test
//Test user route
//access public
router.get("/test", (req, res) => res.json({ msg: "Users working" }));

//POST  /api/users/register
//Register user route
//access public
router.post("/register",UserController.RegisterUser);

//POST  /api/users/login
// user login route return jWT
//access public
router.post("/login",UserController.LoginUser);

//GET  /api/users/current
// return Current user
//access private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  UserController.LoginCurrentUser
);

module.exports = router;
