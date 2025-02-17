//Defines the routes related to authentication (e.g., login, register, logout).

var express = require('express');
const passport = require('../config/passport');
var router = express.Router();
var LocalStrategy = require('passport-local');
const bcrypt = require("bcrypt");
const db = require("../../models/index");
const jwt = require('jsonwebtoken'); 

// Login route
router.post('/login', (req, res, next) => { 

  passport.authenticate('local', { session: false, failureMessage: true }, (err, user, info) => {
    if (err) {
      return next(err); 
    }
    if (!user) {
      return res.status(400).json({ message: info.message || 'Authentication failed' });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        return next(err);
      }
      let token = jwt.sign({ userId: user.id, name: user.name,  }, process.env.JWT_SECRET, {
        expiresIn: "48h",
      });
    res.cookie('jwt', token, { 
      httpOnly: true, 
      secure: true, //SECURE MEANS ONLY RUNS ON HTTPS (NOT HTTP). SHOULD BE TRUE IN PRODUCTION
      maxAge: 3600000 
    }) 
     return res.status(200).json({ message: "Loggin succesful", userId: user.id });
    });
  })(req, res, next); 
});

router.post('/user', passport.authenticate('jwt', { session: false }), async (req, res) => {

  if (!req.user) {
    console.log("error")
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    let userId = req.user.userId
    const user = await db.User.findByPk(userId); // Use the userId from body
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.dataValues);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.get('/getUserProgress', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const userId = req.user.userId;
  try {
    const userProgress = await db.UserCourseProgress.findOne({ where: { user_id: userId } });   
    console.log("userProgress", userProgress)
    if (!userProgress) {
      return res.json({ chapter_progress: 0 });
    } else {
    res.json(userProgress);
    }
  } catch (err){
    console.log("err",err)
    res.status(500).send({ success: false, message: "Internal Server Error" }); // Handle errors gracefully
  }
});



router.put('/userProgressCounter', passport.authenticate('jwt', { session: false }), async (req, res) => {
  
  const { courseId, chapterProgress } = req.body;
  const userId = req.user.userId;
 
  try {
    console.log("userCourse", userId)
    console.log("courseId", courseId)
    console.log("chapterProgress", chapterProgress);

    const [userCourse] = await db.UserCourseProgress.upsert({ 
      user_id: userId, 
      course_id: courseId,
      chapter_progress: chapterProgress
    });
    res.json(userCourse);
  } catch (err){
    console.log("err",err)
    res.status(500).send({ success: false, message: "Internal Server Error" }); // Handle errors gracefully
  }
});




/*
router.post('/user', async (req, res, next) => {
  // Extract the user ID from the request body
  const userId = req.body.userId;
  // Validate the presence of the user ID
  if (!userId) {
    return res.status(400).json({ message: 'Missing user ID in request body' });
  }

  try {
    // Authenticate using Passport.js JWT middleware
    passport.authenticate('jwt', { session: false })(req, res, next);
    console.log("hereee")
  } catch (error) {
    // Handle authentication errors (e.g., invalid token)
    return res.status(401).json({ message: 'Unauthorized' });
  }
  //console.log("req user", req.user)
  
  console.log("authid",userId)
  /*
  // If authentication succeeds (middleware calls next()), proceed
  if (req.user) { // Check if user is authenticated (from middleware)
    const user = await db.User.findByPk(userId);
    try{
    db.User.findById(userId); // Fetch user data
      ().then(() => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
      })
    }.catch(() => {

    });
    res.json(user); // Send user data
    return
  } else {
    // Handle cases where authentication fails after middleware (e.g., token expired)
    return res.status(401).json({ message: 'Unauthorized' });
  }
  */
//});

router.post("/register", async (req, res) => {
  console.log("req",req)
  
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email; // Assuming you want to store email as well

  try {
    const existingUser = await db.User.findOne({ where: { username } }); // Check for existing user using Sequelize
    if (existingUser) {
      // User already exists
      return res.send({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.User.create({ username, email, password: hashedPassword }); // Create new user using Sequelize
    //res.send({ success: true, message: "User registered" }); // Send success message
    // Immediately authenticate the new user
    req.login(newUser, { session: false }, (err) => { // Use req.login to trigger authentication immediately
      if (err) {
        return next(err);
      }
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '48h' });
      res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 48 * 60 * 60 * 1000 });
      return res.status(201).json({ message: "User registered and logged in", userId: newUser.id });
    });
  } catch (err){
    console.log("err",err)
    res.status(500).send({ success: false, message: "Error registering user" }); // Handle errors gracefully
  }
});





router.post('/logout', function(req, res, next){  
    res.cookie('jwt', "", { maxAge: 0 });
    return res.status(201).json({ message: "Logged Out" });
});

module.exports = router;