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
//const session = require('express-session');
const session = require('cookie-session');
require("dotenv").config();
var cors = require('cors');


console.log("process.env.NODE_ENV 2", process.env.NODE_ENV)
const corsOptions = {
  //origin: 'http://localhost:3030', // Or process.env.REACT_APP_URL for production
  origin: process.env.NODE_ENV === "development"
  ? "http://localhost:3030"  // Development
  : "https://one-self.netlify.app", // Production
  
  //origin: 'https://one-self.netlify.app' || "http://localhost:3030" , // PRODUCTION
  credentials: true, // Important for cookies and sessions
};
//app.use(cors(corsOptions)); // Use cors middleware ONLY
/*
app.use(cors({
  origin: ["http://localhost:3030", "https://one-self.netlify.app"],
  credentials: true
}));
*/
const allowedOrigins = [
  "http://localhost:3030",
  "https://one-self.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


//THIS UNDERNEATH SHOULD PROBABLY BE DELETED

app.use(session({
  httpOnly: true,
  secret: 'keyboard cat', //CHANGE THIS!
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: true,
    sameSite: "none"
  }
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

const userRoute = require("./api/routes/user"); // Importing routes
app.use("/user", userRoute); // Authentication Route

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}.`);
});

