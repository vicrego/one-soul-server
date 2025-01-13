// Importing required modules
/*
const router = require("express").Router();


//const db = require("./queries");

const bcrypt = require("bcrypt");

// Initialize Passport and restore authentication state, if any, from the session.
router.use(passport.initialize());
router.use(passport.session()); // persistent login sessions

// Importing Passport configuration
//require("../config/passport")(passport, db);
require("../config/passport")(passport, db);
*/

//Defines the routes related to authentication (e.g., login, register, logout).

var express = require('express');
const passport = require('../config/passport');
var router = express.Router();
var LocalStrategy = require('passport-local');
const bcrypt = require("bcrypt");
const db = require("../../models/index");
const jwt = require('jsonwebtoken'); // Import using require

// Login route



router.post('/login', (req, res, next) => { // Correct: Add next to the route handler
  passport.authenticate('local', { session: false }, (err, user, info) => {
    
    if (err) {
      return next(err); // Correct: Call next(err) to pass the error to Express error handler
    }
    if (!user) {
      return res.status(400).json({ message: info.message || 'Authentication failed' });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        return next(err); // Correct: Call next(err)
      }
      let token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, {
        expiresIn: "1h",
     });
     return res.json({ user, token });
     //return res.cookie('jwt',token, { httpOnly: true, secure: true, maxAge: 3600000 })
    });
  })(req, res, next); // Correct: Call the returned function with req, res, and next
});


/*
router.post("/login", (req, res, next) => {

  
  passport.authenticate("local", (err, user, info) => {

    if (err) {
      
      return next(err); // If error, go to next middleware
    }
    if (!user) {    
      return res.send({ success: false, message: info.message }); // If user not found, send error message
    }
    req.login(user, (err) => {
      if (err) {
        return next(err); // If error, go to next middleware
      }

    
      return res.send({ success: true, message: "authentication succeeded" }); // If success, send success message
    });
  })(req, res, next);
});
*/



/*
router.post('/login', function (req, res, next) {
  console.log("next", next)
  passport.authenticate('local', {session: false}, (err, user, info) => {
    console.log("err", err)
      if (err || !user) {
          return res.status(400).json({
              message: 'Something is not right',
              user   : user
          });
      }
      req.login(user, {session: false}, (err) => {
        if (err) {
             res.send(err);
         }
         // generate a signed son web token with the contents of user object and return it in the response
         const token = jwt.sign(user, 'your_jwt_secret');
         return res.json({user, token});
      });
  })(req, res);
});
*/

/*
router.post("/login", (req, res) => {
  const { username, password } = req.body.values;
  try {
    const user = db.User.findOne({ where: { username } }); 
    console.log("user", user)
    
    if (!user) {
      res.status(401).json({ message: "No such user/email ID found" });
      return;
    }  
    if (user.password === password) {
      console.log("hey")
      const payload = { id: user.id };
      console.log("payload", payload)
      const token = jwt.sign(payload, jwtOptions.secretOrKey);
      console.log("token", token)
      res.json({ message: "OK", token: token });
    } 
  }catch(err) {
    console.error(err);
    res.status(401).json({ message: "Passwords did not match" });
  }
})
*/
/*
router.post('/login/password', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(401).json({ success: false, message: info.message }); // 401 Unauthorized
    }
    // Generate JWT (if using JWTs)
    const token = jwt.sign({ userId: user.id, username: user.username }, 'your_secret_key', { expiresIn: '1h' });
    return res.json({ success: true, message: "Login successful", token: token }); // Send token on success
  })(req, res, next);
});
*/
/*
router.post('/login/password',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    res.redirect('/~' + req.user.username);
  });
*/


// Register route
/*
router.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if user already exists
  db.query(
    "SELECT * FROM Users WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        console.log(err);
      }

      if (result.length > 0) {
        // User already exists
        res.send("User already exists");
      } else {
        // User does not exist, proceed with registration
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            console.log(err);
          }

          db.query(
            "INSERT INTO Users (username, email) VALUES (?,?)",
            [username, email, hash],
            (err, result) => {
              if (err) {
                console.log(err);
              }
              res.send("User registered"); // Send success message
            }
          );
        });
      }
    }
  );
});
*/  

router.post("/register", async (req, res) => {
  
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

    res.send({ success: true, message: "User registered" }); // Send success message
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Error registering user" }); // Handle errors gracefully
  }
});




// Logout route
router.post("/logout", (req, res, next) => {
  //generic logout method in passport
  req.logout((err) => {
    if (err) {
      return next(err); // If error, go to next middleware
    }
  });
  res.send({ success: true, message: "logout succeeded" }); // If success, send success message
});

// Get user data route
/*
router.get("/user", (req, res) => {
  console.log("req user", req)
  res.send(req.user); // Send user data
});
*/
// Exporting router to be used in other parts of the application
module.exports = router;