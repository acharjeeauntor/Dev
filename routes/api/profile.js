const express = require("express");
const router = express.Router();
const passport = require("passport");

const profileController = require("../../controllers/Profile");

//GET  /api/profile/test
//Test profile route
//access public
router.get("/test", (req, res) => res.json({ msg: "profile working" }));

//GET  /api/profile
//Get Current Profile
//access private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  profileController.getCurrentUserProfile
);

//GET  /api/profile/handle/:handle
//Get Profile by handle
//access public
router.get("/handle/:handle", profileController.getProfileByHandle);

//GET  /api/profile/all
//Get all Profile
//access public
router.get("/all", profileController.getAllProfile);

//GET  /api/profile/user/:user_id
//Get Profile by user_id
//access public
router.get("/user/:user_id", profileController.getProfileByUserId);

//POST  /api/profile
//Create User Profile
//access private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  profileController.createUserProfile
);

//POST  /api/profile/experience
//Add User experience in Profile
//access private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  profileController.addExperience
);

//POST  /api/profile/education
//Add User education in Profile
//access private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  profileController.addEducation
);

//DELETE /api/profile/experience/:exp_id
//Delete User experience from Profile
//access private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  profileController.deleteExperience
);

//DELETE /api/profile/education/:edu_id
//Delete User education from Profile
//access private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  profileController.deleteEducation
);

//DELETE /api/profile/
//Delete User and profile
//access private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  profileController.deleteUserAndProfile
);
module.exports = router;
