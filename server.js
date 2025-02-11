/*
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




app.use(express.json());
app.use("/record", records);

*/

const express = require("express");
var bodyParser = require('body-parser')
const app = express();
const session = require('express-session')
require("dotenv").config();
var cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3030', // Or process.env.REACT_APP_URL for production
  credentials: true, // Important for cookies and sessions
};
app.use(cors(corsOptions)); // Use cors middleware ONLY


//THIS UNDERNEATH SHOULD PROBABLY BE DELETED
app.use(session({
  httpOnly: true,
  secret: 'keyboard cat', //CHANGE THIS!
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));


const passport = require('./api/config/passport');
app.use(passport.initialize()); // initializes authentication module
app.use(passport.session())


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const contentRoute = require("./api/routes/content");
app.use("/content", contentRoute); // Authentication Route


/*
app.get("/users", db.getUsers);
app.get("/user", db.getUserById);
app.post("/create-user", db.createUser);
app.put("/update-user", db.updateUser);
app.delete("/delete-user", db.deleteUser);
*/

var morgan = require('morgan');
const helmet = require("helmet");



app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(helmet());


const authRoute = require("./api/routes/auth"); // Importing routes
app.use("/auth", authRoute); // Authentication Route


app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}.`);
});

