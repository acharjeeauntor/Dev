const express = require("express");
const router = express.Router();
const postController = require("../../controllers/Post");
const passport = require("passport");

//GET  /api/posts/test
//Test posts route
//access public
router.get("/test", (req, res) => res.json({ msg: "posts working" }));

//POST  /api/posts/
//Create a Post
//access private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  postController.createPost
);

//POST  /api/posts/like/:id  <-this is a post id
//Add Like to a post
//access private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  postController.postALike
);

//POST  /api/posts/unlike/:id   <-this is a post id
//Add Unlike to a post
//access private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  postController.postUnLike
);

//POST  /api/posts/comment/:id   <-this is a post id
//Add a comment in post
//access private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  postController.postAComment
);

//DELETE  /api/posts/comment/:id/:comment_id   <-this is a post id
//Add a comment in post
//access private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  postController.deleteAComment
);

//GET  /api/posts/
//Get All Posts
//access public
router.get("/", postController.getAllPost);

//GET  /api/posts/:id  <-this is a post id
//Get A Single Post by ID
//access public
router.get("/:id", postController.getASinglePost);

//DELETE  /api/posts/:id  <-this is a post id
//Delete A Single Post by ID
//access private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  postController.deleteASinglePost
);

module.exports = router;
