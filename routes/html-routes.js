// Requiring path to so we can use relative routes to our HTML files
var path = require("path");
var db = require("../models");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", function(req, res) {
    // If the user already has an account send them to the profile page
    if (req.user) {
      res.redirect("/profile");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the profile page
    if (req.user) {
      res.redirect("/profile");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/profile", isAuthenticated, function(req, res) {
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
      console.log(user);
      res.render("profile", user);
    });
  });
  app.get("/posts", function(req, res) {
    db.Category.findAll({ include: [db.Post] }).then(results => {
      let categories = [];

      results.forEach(element => {
        let currPosts = [];
        element.Posts.forEach(post => {
          let thisPost = {
            id: post.id,
            title: post.title,
            created: post.createdAt
          };
          currPosts.push(thisPost);
        });
        let thisCat = {
          name: element.name,
          id: element.id,
          posts: currPosts
        };
        categories.push(thisCat);
      });
      res.render("posts", { categories: categories });
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

  app.get("/posts/:postID", function(req, res) {
    db.Post.findOne({
      where: {
        id: req.params.postID
      },
      include: [db.User, db.Reply]
    }).then(results => {
      let replies = [];

      results.Replies.forEach(element => {
        let newReply = {
          body: element.body,
          created: element.createdAt,
          userId: element.UserId
        };
        replies.push(newReply);
      });
      let post = {
        id: results.id,
        title: results.title,
        body: results.body,
        created: results.createdAt,
        displayName: results.User.displayName,
        userId: results.User.id,
        viewerId: req.user.id,
        replies: replies
      };

      res.render("singlePost", post);
    });
  });

  app.get("/signup", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/signup2.html"));
  });
};
