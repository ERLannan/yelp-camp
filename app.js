var express    = require("express"),
app            = express(),
bodyParser     = require("body-parser"),
mongoose       = require("mongoose"),
passport       = require("passport"),
methodOverride = require("method-override"),
LocalStrategy  = require("passport-local"),
flash          = require("connect-flash"),
Campground     = require("./models/campground"),
Comment        = require("./models/comment"),
User           = require("./models/user"),
seedDB         = require("./seeds");

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");


//mongoose.connect("mongodb://localhost/yelp_camp_v13", {useNewUrlParser: true});
mongoose.connect("mongodb://eric:mosby1@ds257314.mlab.com:57314/erl_yelp_camp", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Passport
app.use(require("express-session")({
    secret: "NTNkZDg0NTUtY2MwMS00YjBlLWIwZDEtM2E5MDM5ZDFjOTNi",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//This allows all routes to have access to currentUser
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
//seedDB();

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("YelpCamp app server started: v13"); 
});



