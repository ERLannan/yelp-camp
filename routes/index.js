var express = require("express");
var router = express.Router();
var passport       = require("passport");
var User = require("../models/user");

router.get("/", function(req, res) {
   res.render("landing");
});

// ============================Comments========================== 

//=--------------- auth routes
//Show signup page
router.get("/register", function(req, res) {
   res.render("register"); 
});

//add new user
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            //console.log(err);
            req.flash("error", err.message);
            res.redirect("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome " + user.username +"!");
                res.redirect("/campgrounds"); 
            });
        }
    });
    
});

//show login screen
router.get("/login", function(req, res) {
   res.render("login");
});

//login attempt route
router.post("/login", passport.authenticate("local", 
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }),function(req, res) {
  //      res.send("being logged in");
});

//logout current user
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("error", "You have been logged out!");
    res.redirect("/campgrounds");
});

// //404 page
// router.get("/*", function (req, res) {
//     res.send("404 - Page not found");
// });

// function isLoggedIn(req, res, next) {
//     if(req.isAuthenticated()) {
//         return next();
//     } 
//     res.redirect("/login");
// }

module.exports = router;