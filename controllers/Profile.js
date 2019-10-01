const mongoose = require("mongoose");

//User or Profile Models
const Profile = require("../models/Profile");
const User = require("../models/User");

//profile validation
const validateProfileInput = require("../validation/profile");
const validateExperienceInput = require("../validation/experience");
const validateEducationInput = require("../validation/education");

//get current user profile
exports.getCurrentUserProfile = (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile For this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) => console.log(err));
};

exports.createUserProfile = (req, res) => {
  //check input validation
  const { errors, isValid } = validateProfileInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  //get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername)
    profileFields.githubusername = req.body.githubusername;
  // Skills split into array
  if (typeof req.body.skills !== "undefined") {
    profileFields.skills = req.body.skills.split(",");
  }

  //social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      if (profile) {
        //update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )
          .then((profile) => res.json(profile))
          .catch((err) => console.log(err));
      } else {
        //create
        //check handle exists
        Profile.findOne({ handle: profileFields.handle })
          .then((profile) => {
            if (profile) {
              errors.handle = "That handle already exists";
              res.status(400).json(errors);
            }

            new Profile(profileFields)
              .save()
              .then((profile) => {
                res.json(profile);
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
};

//Get All profile
exports.getAllProfile = (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = "There is no profile.";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch((err) =>
      res.status(404).json({ profile: "There is no profile for this user." })
    );
};

//Get profile by handle
exports.getProfileByHandle = (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      //console.log('user',profile)
      res.json(profile);
    })
    .catch((err) => res.status(404).json(err));
};

//Get profile by user id.
exports.getProfileByUserId = (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) =>
      res.status(404).json({ profile: "There is no profile for this user." })
    );
};

//Add Experience in Profile
exports.addExperience = (req, res) => {
  //check input validation
  const { errors, isValid } = validateExperienceInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { title, company, location, from, to, current, description } = req.body;
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      };

      //add to experience array
      profile.experience.unshift(newExp);
      profile
        .save()
        .then((profile) => res.json(profile))
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      console.log(err);
    });
};

//Add Education in Profile
exports.addEducation = (req, res) => {
  //check input validation
  const { errors, isValid } = validateEducationInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body;
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      //here no use new profile ,caz it is not a models based obj,it a general obj.
      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      };

      //add to education array
      profile.education.unshift(newEdu);
      profile
        .save()
        .then((profile) => res.json(profile))
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      console.log(err);
    });
};

//Delete Experience from Profile
exports.deleteExperience = (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      //get remove index
      const removeIndex = profile.experience
        .map((item) => item.id)
        .indexOf(req.params.exp_id);
      //splice out of array
      //splice(removeIndex,amountof remove index,new added index)
      profile.experience.splice(removeIndex, 1);
      profile
        .save()
        .then((profile) => res.json(profile))
        .catch((err) => console.log(err));
    })
    .catch((err) => res.status(404).json(err));
};

//Delete Education from Profile
exports.deleteEducation = (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      //get remove index
      const removeIndex = profile.education
        .map((item) => item.id)
        .indexOf(req.params.edu_id);
      //splice out of array
      profile.education.splice(removeIndex, 1);
      profile
        .save()
        .then((profile) => res.json(profile))
        .catch((err) => console.log(err));
    })
    .catch((err) => res.status(404).json(err));
};

//Delete User And Profile
exports.deleteUserAndProfile = (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id })
    .then(() => {
      User.findOneAndRemove({ _id: req.user.id })
        .then(() => res.json({success:true}))
      .catch(err=>console.log(err))
    })
    .catch((err) => console.log(err));
};
