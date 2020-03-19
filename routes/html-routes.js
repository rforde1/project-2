// Requiring path to so we can use relative routes to our HTML files
var path = require("path");
var db = require("../models");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function(req, res) {
    console.log("yest");
    // res.sendFile(path.join(__dirname, "../public/members.html"));
    db.User.findOne({
      where: {
        id: req.user.id
      },
      include: [db.Post]
    }).then(results => {
      let posts = [];
      results.dataValues.Posts.forEach(element => {
        let thisPost = {
          title: element.dataValues.title,
          id: element.dataValues.id
        };
        posts.push(thisPost);
      });
      let user = {
        id: results.dataValues.id,
        email: results.dataValues.email,
        displayName: results.dataValues.displayName,
        bio: results.dataValues.bio,
        posts: posts
      };
      res.render("profile", user);
    });
  });

  app.get("/user/:userID", function(req, res) {
    db.User.findOne({
      where: {
        id: req.params.userID
      },
      include: [db.Post]
    }).then(results => {
      let posts = [];
      results.dataValues.Posts.forEach(element => {
        let thisPost = {
          title: element.dataValues.title,
          id: element.dataValues.id
        };
        posts.push(thisPost);
      });
      let user = {
        id: results.dataValues.id,
        email: results.dataValues.email,
        displayName: results.dataValues.displayName,
        bio: results.dataValues.bio,
        posts: posts
      };
      res.render("other_profile", user);
    });
  });

  app.get("/createPost", function(req, res) {
    res.render("createPost", { id: req.user.id });
  });

  app.get("/home", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/home.html"));
  });

  app.get("/signup", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/signup2.html"));
  });
};
