/*const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello from MERN stack!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});

//connecting mongo with mongoose

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/my-mern-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB.');
}).catch(error => {
  console.error(error);
});*/
/*
import express from "express";
import cors from "cors";
import records from "./routes/record.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


*/


const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./queries");
require("dotenv").config();

var cors = require('cors');
app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "hello" });
});



app.get('/courses', async (req, res) => {
  try {
    const courses = await db.getCourses();
    const sortedData = courses.sort((a, b) => a.course_id - b.course_id);
    console.log("courses", courses)
    res.json(sortedData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching chapters');
  }
});

app.get('/chapters', async (req, res) => {
  try {
    const chapters = await db.getChapters();
    res.json(chapters);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching chapters');
  }
});

app.get('/topics', async (req, res) => {
  try {
    const topics = await db.getTopics();
    //console.log(topics)
    const sortedData = topics.sort((a, b) => a.topic_id - b.topic_id);

    res.json(sortedData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching chapters');
  }
});


app.get('/challenges_chapter', async (req, res) => {
  try {
    const challenges = await db.getChallengesChapter();
    const sortedData = challenges.sort((a, b) => a.challenge_order - b.challenge_order);

    //console.log(sortedData)
    
    res.json(sortedData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching chapters');
  }
});

app.get('/challenges_free', async (req, res) => {
  try {
    const challenges = await db.getChallengesFree();
    //const sortedData = challenges.sort((a, b) => a.challenge_order - b.challenge_order);
    //Sort must be random
    //console.log(challenges)
    
    res.json(challenges);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching chapters');
  }
});

app.get('/challenges', async (req, res) => {
  try {
    const challenges = await db.getChallenges();
    //const sortedData = challenges.sort((a, b) => a.challenge_order - b.challenge_order);
    //Sort must be random
    //console.log(challenges)
    console.log("here",challenges)
    res.json(challenges);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching chapters');
  }
});

/*
app.get("/users", db.getUsers);
app.get("/user", db.getUserById);
app.post("/create-user", db.createUser);
app.put("/update-user", db.updateUser);
app.delete("/delete-user", db.deleteUser);
*/


app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}.`);
});