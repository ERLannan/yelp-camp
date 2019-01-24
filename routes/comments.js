var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//show new comments page
router.get("/new", middleware.isLoggedIn, function(req, res) {
   Campground.findById(req.params.id, function(err, campground) {
       if(err) {
           console.log(err);
       } else {
           res.render("comments/new", {campground, campground});
       }});
});

//submit new comment
router.post("/", middleware.isLoggedIn,function(req, res) {
   Campground.findById(req.params.id, function(err, campground) {
       if(err) {
           console.log(err);
           req.flash("error", "Something went wrong.");
           res.redirect("/campgrounds");
       } else {
           Comment.create(req.body.comment, function(err, comment){
               if(err) {
                   req.flash("error", "Something went wrong.");
                   console.log(err);
               } else {
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   
                   console.log(comment);
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
       }
   }); 
});

//Edit comment
router.get("/:comment_id/edit", middleware.isUsersComment, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment) {
       if(err) {
           req.flash("error", "Something went wrong.");
           res.redirect("back");
       } else {
           res.render("comments/edit", {campground_id: req.params.id, comment: comment});
       }
    });
});

//Update comment
router.put("/:comment_id", middleware.isUsersComment, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err) {
            req.flash("error", "Something went wrong.");
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.isUsersComment, function(req, res) {
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err) {
           req.flash("error", "Something went wrong.");
           console.log(err);
       } else {
           res.redirect("/campgrounds/" + req.params.id);
           
       }
       
   });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } 
    res.redirect("/login");
}

function isUsersComment(req, res, next) {
    if(req.isAuthenticated()) {
       Comment.findById(req.params.comment_id, function(err, foundComment) {
           if(err) {
               console.log(err);
               res.redirect("back");
           } else {
               if(foundComment.author.id.equals(req.user._id)) {
                   next();
               } else {
                   console.log("not the users comment");
                   res.redirect("back");
               }
           }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;