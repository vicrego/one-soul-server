var express = require('express');
var router = express.Router();
const db = require("../../queries");



router.get("/", (request, response) => {
  response.json({ info: "hello" });
});

router.get('/courses', async (req, res) => {
    try {
      const courses = await db.getCourses();
      const sortedData = courses.sort((a, b) => a.course_id - b.course_id);
      res.json(sortedData);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching chapters');
    }
  });
  
router.get('/chapters', async (req, res) => {
    try {
      const chapters = await db.getChapters();
      res.json(chapters);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching chapters');
    }
  });
  
router.get('/topics', async (req, res) => {
    try {
      const topics = await db.getTopics();
      const sortedData = topics.sort((a, b) => a.topic_id - b.topic_id);
  
      res.json(sortedData);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching chapters');
    }
  });
  
router.get('/challenges_chapter', async (req, res) => {
    try {
      const challenges = await db.getChallengesChapter();
      const sortedData = challenges.sort((a, b) => a.challenge_order - b.challenge_order);    
      res.json(sortedData);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching chapters');
    }
  });
  
router.get('/challenges_free', async (req, res) => {
    try {
      const challenges = await db.getChallengesFree();
      res.json(challenges);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching chapters');
    }
  });
  
router.get('/challenges', async (req, res) => {
    try {
        const challenges = await db.getChallenges();
        //const sortedData = challenges.sort((a, b) => a.challenge_order - b.challenge_order);
        //Sort must be random
        //console.log(challenges)
        res.json(challenges);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching chapters');
    }
});


module.exports = router;