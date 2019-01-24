//all middleware
var express = require("express");
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } 
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

middlewareObj.isUsersCampground = function(req, res, next) {
    if(req.isAuthenticated()) {
       Campground.findById(req.params.id, function(err, foundCampground) {
           if(err) {
               console.log(err);
               req.flash("error", "Campground not found.");
               res.redirect("back");
           } else {
                if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
               if(foundCampground.author.id.equals(req.user._id)) {
                   next();
               } else {
                   req.flash("error", "You are not the author of the campground post");
                   res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}


middlewareObj.isUsersComment = function(req, res, next) {
    if(req.isAuthenticated()) {
       Comment.findById(req.params.comment_id, function(err, foundComment) {
           if(err) {
               console.log(err);
               req.flash("error", "Comment does not exist");
               res.redirect("back");
           } else {
               if(foundComment.author.id.equals(req.user._id)) {
                   next();
               } else {
                   req.flash("error", "You dont have permission to do that");
                   res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}


module.exports = middlewareObj