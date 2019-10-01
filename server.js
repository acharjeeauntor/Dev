const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require('path')

//Import Routes
const UsersRoute = require("./routes/api/users");
const PostsRoute = require("./routes/api/posts");
const ProfileRoute = require("./routes/api/profile");

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB config
const db = require("./config/keys").mongoURI;

//Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

//passport middleware
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

//Routes
app.use("/api/users", UsersRoute);
app.use("/api/posts", PostsRoute);
app.use("/api/profile", ProfileRoute);

//server static assets in production
if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server Run on port ${port}`));