const mongoose = require("mongoose");

const Post = require("../models/Post");
const Profile = require("../models/Profile");
const validatePostInput = require("../validation/post");

exports.createPost = (req, res) => {
  //check input validation
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { text, name, avatar } = req.body;
  const newPost = new Post({
    user: req.user.id,
    text,
    name,
    avatar
  });

  newPost
    .save()
    .then((post) => res.json(post))
    .catch((err) => console.log(err));
};

//Get All Posts
exports.getAllPost = (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ nopostsfound: "No posts found!!" }));
};

//Get A Single Post
exports.getASinglePost = (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ nopostfound: "No post found!!" });
      }
      res.json(post);
    })
    .catch((err) => res.status(404).json({ nopostfound: "No post found!!" }));
};

//Delete a single post
exports.deleteASinglePost = (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          //check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "user not authorized" });
          }
          //Delete
          post
            .remove()
            .then(() => res.json({ success: true }))
            .catch((err) => console.log(err));
        })
        .catch((err) => res.status(404).json({ nopostfound: "No post found" }));
    })
    .catch((err) => console.log(err));
};

//For A Like on A Post
exports.postALike = (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already Liked this post" });
          }
          //Add a like in likes array
          post.likes.unshift({ user: req.user.id });
          post
            .save()
            .then((post) => res.json(post))
            .catch((err) => console.log(err));
        })
        .catch((err) =>
          res.status(404).json({ postnotfound: "Post Not Found" })
        );
    })
    .catch((err) => console.log("You are not enable to like"));
};

//For A Unlike on A Post
exports.postUnLike = (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      //console.log("profile", profile);
      Post.findById(req.params.id)
        .then((post) => {
          //console.log("post", post);
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not yet like this post" });
          }
          //Get remove index
          const removeIndex = post.likes
            .map((item) => item.user.toString())
            .indexOf(req.user.id);
          //splice out of array
          post.likes.splice(removeIndex, 1);
          //save new like array
          post
            .save()
            .then((post) => res.json(post))
            .catch((err) => console.log(err));
        })
        .catch((err) =>
          res.status(404).json({ postnotfound: "Post Not Found" })
        );
    })
    .catch((err) => console.log("You are not enable to unlike"));
};

//Add A Comment in Post
exports.postAComment = (req, res) => {
  //check input validation
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { text, name, avatar } = req.body;
  Post.findById(req.params.id)
    .then((post) => {
      const newComment = {
        text,
        name,
        avatar,
        user: req.user.id
      };

      //Add to comments array
      post.comments.unshift(newComment); // unshift kono element remove korbe na just array er 1st element e add kore dibe.
      //save
      post.save().then((post) => res.json(post));
    })
    .catch((err) => res.status(404).json({ nopostfound: "No post found" }));
};

//Delete A Comment in Post
exports.deleteAComment = (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      console.log('post',post)
      //check to see if comment exists
      if (
        post.comments.filter(
          (comment) => comment._id.toString() === req.params.comment_id
        ).length === 0
      ) {
        return res
          .status(400)
          .json({ commentnotexists: "comment dose not exists" });
      }

      //Get remove index
      const removeIndex = post.comments
        .map((item) => item._id.toString())
        .indexOf(req.params.comment_id);
      //splice comment out of array 
      post.comments.splice(removeIndex, 1)
      //save
      post.save().then(post=>res.json(post))
    })
    .catch((err) => res.status(404).json({ nopostfound: "No post found" }));
};
