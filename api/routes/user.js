
var express = require('express');
var router = express.Router();

const passport = require('../config/passport');
const db = require('../../models');




router.post("/firstTimeEntry", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
    
      const userId = req.user.userId; // if using sessions or passport.js
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const user = await db.User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.firstTimeEntry = false;
      await user.save();
  
      res.status(200).json({ message: 'First time entry flag updated' });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get("/getFirstTimeEntry", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const userId = req.user.userId;
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const user = await db.User.findByPk(userId);
    console.log("firstTimeEntry: req.user.firstTimeEntry", user.firstTimeEntry)
    return res.json({ firstTimeEntry: user.firstTimeEntry });
  });
/*
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  return res.json({ firstTimeEntry: req.user.firstTimeEntry });
  */
  module.exports = router;