 var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Show all campgrounds
router.get("/", function(req, res) {
    Campground.find({}, function(err, campgrounds){
        if (err) {
            console.log("Error getting campgrounds: " + err);
        } else {
            res.render("campgrounds/index", {data: campgrounds, currentUser:req.user});
        }
    });
});

//Add campground to the DB, show all
router.post("/",middleware.isLoggedIn, function(req, res){
   var name = req.body.name;
   var img = req.body.imageurl;
   var prc = req.body.price;
   var desc = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   }
   var newCampground = {name: name, price: prc, image: img, description: desc, author: author};
   
   Campground.create(newCampground, function(err, item){
        if (err) {
            console.log("Error saving Campground to DB: " + err);
        } else {
            console.log("Campground created:");
            console.log(item);
        }
    });
   
   res.redirect("/campgrounds"); 
});

//Show add campground page
router.get("/new",middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new");
});

//show specific campground
router.get("/:id", function(req, res) {
   //This will get a specific campground one day 
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
       if(err) {
           console.log(err);
       } else {
           res.render("campgrounds/show", {campground: foundCampground});
       }
   });
});

//Edit Campground
router.get("/:id/edit", middleware.isUsersCampground, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            res.redirect("/back");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});
//Update Campground
router.put("/:id", middleware.isUsersCampground, function(req, res){
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
     console.log(updatedCampground);
     if(err) {
         res.redirect("/campgrounds");
     } else {
         res.redirect("/campgrounds/" + req.params.id)
     } 
   });
});

//Delete
router.delete("/:id", middleware.isUsersCampground, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        }
        res.redirect("/campgrounds");
    })
});

function addCampground(name, img, des) {
    Campground.create({
        name: name, 
        image: img,
        description: des
    }, function(err, item){
        if (err) {
            console.log("Error saving Campground to DB: " + err);
        } else {
            console.log("Campground created:");
            console.log(item);
        }
    });
}

// function isLoggedIn(req, res, next) {
//     if(req.isAuthenticated()) {
//         return next();
//     } 
//     res.redirect("/login");
// }

// function isUsersCampground(req, res, next) {
//     if(req.isAuthenticated()) {
//       Campground.findById(req.params.id, function(err, foundCampground) {
//           if(err) {
//               console.log(err);
//               res.redirect("back");
//           } else {
//               if(foundCampground.author.id.equals(req.user._id)) {
//                   next();
//               } else {
//                   res.redirect("back");
//               }
//           }
//         });
//     } else {
//         res.redirect("back");
//     }
// }

module.exports = router;